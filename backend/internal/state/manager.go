package state

import (
	"sync"
	"time"
	"load-balancer/internal/logger"
)

type Manager struct {
	mu  sync.RWMutex
	vms map[string]*VMState
}

func NewManager() *Manager {
	return &Manager{
		vms: make(map[string]*VMState),
	}
}

func (m *Manager) UpsertFromMetrics(
	vmID string,
	vmIP string,
	metrics Metrics,
) {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now()

	vm, exists := m.vms[vmID]
	if !exists {
		m.vms[vmID] = &VMState{
			VMID:           vmID,
			VMIP:           vmIP,
			Status:         StatusActive,
			Metrics:        metrics,
			LastReportedAt: now,
		}

		logger.Info("New VM registered: " + vmID)
		logger.MetricsUpdate(vmID, metrics.LoadPercent)
		return
	}

	// Existing VM
	prevState := vm.Status

	vm.VMIP = vmIP
	vm.Metrics = metrics
	vm.LastReportedAt = now
	vm.Status = StatusActive

	if prevState != StatusActive {
		logger.StateChange(vmID, string(prevState), string(StatusActive))
	}

	logger.MetricsUpdate(vmID, metrics.LoadPercent)
}

func (m *Manager) GetAll() map[string]*VMState {
	m.mu.RLock()
	defer m.mu.RUnlock()

	copy := make(map[string]*VMState)
	for k, v := range m.vms {
		copy[k] = v
	}
	return copy
}

