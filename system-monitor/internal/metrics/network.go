package metrics

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/adithyanajay/system-monitor/internal/models"
)

type NetworkReader struct {
	prevStats      *models.NetworkStats
	capacityMbps   float64
	collectionInterval float64
}

func NewNetworkReader(capacityMbps float64, collectionInterval int) *NetworkReader {
	return &NetworkReader{
		capacityMbps:   capacityMbps,
		collectionInterval: float64(collectionInterval),
	}
}

func (r *NetworkReader) Read() (*models.NetworkStats, error) {
	file, err := os.Open("/proc/net/dev")
	if err != nil {
		return nil, fmt.Errorf("failed to open /proc/net/dev: %w", err)
	}
	defer file.Close()

	var totalRx, totalTx uint64
	scanner := bufio.NewScanner(file)

	lineNum := 0
	for scanner.Scan() {
		lineNum++
		if lineNum <= 2 {
			continue
		}

		line := scanner.Text()
		colonIdx := strings.Index(line, ":")
		if colonIdx == -1 {
			continue
		}

		interfaceName := strings.TrimSpace(line[:colonIdx])
		if interfaceName == "lo" {
			continue
		}

		fields := strings.Fields(line[colonIdx+1:])
		if len(fields) < 9 {
			continue
		}

		rxBytes, _ := strconv.ParseUint(fields[0], 10, 64)
		txBytes, _ := strconv.ParseUint(fields[8], 10, 64)

		totalRx += rxBytes
		totalTx += txBytes
	}

	currentStats := &models.NetworkStats{
		RxBytes:    totalRx,
		TxBytes:    totalTx,
		TotalBytes: totalRx + totalTx,
	}

	if r.prevStats != nil {
		deltaRx := currentStats.RxBytes - r.prevStats.RxBytes
		deltaTx := currentStats.TxBytes - r.prevStats.TxBytes
		deltaTotal := deltaRx + deltaTx

		bytesPerSecond := float64(deltaTotal) / r.collectionInterval
		megabytesPerSecond := bytesPerSecond / (1024 * 1024)
		megabitsPerSecond := megabytesPerSecond * 8

		currentStats.ThroughputMbps = megabitsPerSecond

		if r.capacityMbps > 0 {
			currentStats.UsagePercent = 100.0 * megabitsPerSecond / r.capacityMbps
			if currentStats.UsagePercent > 100.0 {
				currentStats.UsagePercent = 100.0
			}
		}
	}

	r.prevStats = currentStats
	return currentStats, nil
}
