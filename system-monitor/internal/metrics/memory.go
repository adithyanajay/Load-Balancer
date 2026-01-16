package metrics

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/adithyanajay/system-monitor/internal/models"
)

type MemoryReader struct{}

func NewMemoryReader() *MemoryReader {
	return &MemoryReader{}
}

func (r *MemoryReader) Read() (*models.MemoryStats, error) {
	file, err := os.Open("/proc/meminfo")
	if err != nil {
		return nil, fmt.Errorf("failed to open /proc/meminfo: %w", err)
	}
	defer file.Close()

	stats := &models.MemoryStats{}
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := scanner.Text()
		fields := strings.Fields(line)
		if len(fields) < 2 {
			continue
		}

		key := strings.TrimSuffix(fields[0], ":")
		value, err := strconv.ParseUint(fields[1], 10, 64)
		if err != nil {
			continue
		}

		switch key {
		case "MemTotal":
			stats.Total = value
		case "MemAvailable":
			stats.Available = value
		}
	}

	if stats.Total == 0 {
		return nil, fmt.Errorf("failed to read memory total")
	}

	stats.Used = stats.Total - stats.Available
	stats.UsagePercent = 100.0 * float64(stats.Used) / float64(stats.Total)

	return stats, nil
}
