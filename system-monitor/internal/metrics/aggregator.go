package metrics

import (
	"fmt"
	"sync"
	"time"

	"github.com/adithyanajay/system-monitor/internal/config"
	"github.com/adithyanajay/system-monitor/internal/models"
)

type Aggregator struct {
	config        *config.Config
	cpuReader     *CPUReader
	memoryReader  *MemoryReader
	networkReader *NetworkReader

	mu             sync.RWMutex
	currentMetrics *models.Metrics
}

func NewAggregator(cfg *config.Config) *Aggregator {
	return &Aggregator{
		config:        cfg,
		cpuReader:     NewCPUReader(),
		memoryReader:  NewMemoryReader(),
		networkReader: NewNetworkReader(
			cfg.Network.CapacityMbps,
			cfg.Monitoring.CollectionIntervalSeconds,
		),
		currentMetrics: &models.Metrics{},
	}
}

func (a *Aggregator) Collect() error {
	cpuStats, err := a.cpuReader.Read()
	if err != nil {
		return fmt.Errorf("failed to read CPU stats: %w", err)
	}

	memStats, err := a.memoryReader.Read()
	if err != nil {
		return fmt.Errorf("failed to read memory stats: %w", err)
	}

	netStats, err := a.networkReader.Read()
	if err != nil {
		return fmt.Errorf("failed to read network stats: %w", err)
	}

	loadPercent :=
		(cpuStats.UsagePercent * a.config.Weights.CPU) +
			(memStats.UsagePercent * a.config.Weights.Memory) +
			(netStats.UsagePercent * a.config.Weights.Network)

	a.mu.Lock()
	a.currentMetrics = &models.Metrics{
		Timestamp:      time.Now(),
		LoadPercent:    loadPercent,
		CPUPercent:     cpuStats.UsagePercent,
		MemoryPercent:  memStats.UsagePercent,
		NetworkMbps:    netStats.ThroughputMbps,
		NetworkPercent: netStats.UsagePercent,
	}
	a.mu.Unlock()

	return nil
}

func (a *Aggregator) GetCurrentMetrics() *models.Metrics {
	a.mu.RLock()
	defer a.mu.RUnlock()

	metricsCopy := *a.currentMetrics
	return &metricsCopy
}
