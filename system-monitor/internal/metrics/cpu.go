package metrics

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/adithyanajay/system-monitor/internal/models"
)

type CPUReader struct {
	prevStats *models.CPUStats
}

func NewCPUReader() *CPUReader {
	return &CPUReader{}
}

func (r *CPUReader) Read() (*models.CPUStats, error) {
	file, err := os.Open("/proc/stat")
	if err != nil {
		return nil, fmt.Errorf("failed to open /proc/stat: %w", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	if !scanner.Scan() {
		return nil, fmt.Errorf("failed to read /proc/stat")
	}

	line := scanner.Text()
	if !strings.HasPrefix(line, "cpu ") {
		return nil, fmt.Errorf("invalid /proc/stat format")
	}

	fields := strings.Fields(line)
	if len(fields) < 6 {
		return nil, fmt.Errorf("insufficient fields in /proc/stat")
	}

	user, _ := strconv.ParseUint(fields[1], 10, 64)
	nice, _ := strconv.ParseUint(fields[2], 10, 64)
	system, _ := strconv.ParseUint(fields[3], 10, 64)
	idle, _ := strconv.ParseUint(fields[4], 10, 64)
	iowait, _ := strconv.ParseUint(fields[5], 10, 64)

	total := user + nice + system + idle + iowait

	currentStats := &models.CPUStats{
		User:   user,
		Nice:   nice,
		System: system,
		Idle:   idle,
		IOWait: iowait,
		Total:  total,
	}

	if r.prevStats != nil {
		deltaTotal := currentStats.Total - r.prevStats.Total
		deltaIdle := (currentStats.Idle + currentStats.IOWait) -
			(r.prevStats.Idle + r.prevStats.IOWait)

		if deltaTotal > 0 {
			currentStats.UsagePercent =
				100.0 * float64(deltaTotal-deltaIdle) / float64(deltaTotal)
		}
	}

	r.prevStats = currentStats
	return currentStats, nil
}
