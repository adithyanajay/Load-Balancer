package metrics

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/adithyanajay/system-monitor/internal/config"
	"github.com/adithyanajay/system-monitor/internal/models"
	"github.com/adithyanajay/system-monitor/internal/utils"
)

type Aggregator struct {
	config        *config.Config
	cpuReader     *CPUReader
	memoryReader  *MemoryReader
	networkReader *NetworkReader

	mu            sync.RWMutex
	currentMetrics *models.Metrics
	vmIP          string
}

func NewAggregator(cfg *config.Config) *Aggregator {
	return &Aggregator{
		config:        cfg,
		cpuReader:     NewCPUReader(),
		memoryReader:  NewMemoryReader(),
		networkReader: NewNetworkReader(cfg.Network.CapacityMbps, cfg.Monitoring.CollectionIntervalSeconds),
		currentMetrics: &models.Metrics{
			VMID: cfg.VM.ID,
		},
	}
}

func (a *Aggregator) ensureVMIP() error {
	a.mu.Lock()
	defer a.mu.Unlock()

	if a.vmIP == "" {
		ip, err := utils.GetVMIP()
		if err != nil {
			return fmt.Errorf("failed to get VM IP: %w", err)
		}
		a.vmIP = ip
		log.Printf("VM IP detected: %s", a.vmIP)
	}

	return nil
}

func (a *Aggregator) Collect() error {
	if err := a.ensureVMIP(); err != nil {
		return err
	}

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

	loadPercent := (cpuStats.UsagePercent * a.config.Weights.CPU) +
		(memStats.UsagePercent * a.config.Weights.Memory) +
		(netStats.UsagePercent * a.config.Weights.Network)

	a.mu.Lock()
	a.currentMetrics = &models.Metrics{
		VMID:           a.config.VM.ID,
		VMIP:           a.vmIP,
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
