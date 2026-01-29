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

// Total number of VMs ever seen (active + suspect + disabled)
func (m *Manager) Total() int {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return len(m.vms)
}

// Count VMs by status
func (m *Manager) CountByStatus(status VMStatus) int {
	m.mu.RLock()
	defer m.mu.RUnlock()

	count := 0
	for _, vm := range m.vms {
		if vm.Status == status {
			count++
		}
	}
	return count
}

// Latest timestamp among all VMs
func (m *Manager) LastUpdate() time.Time {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var latest time.Time
	for _, vm := range m.vms {
		if vm.LastReportedAt.After(latest) {
			latest = vm.LastReportedAt
		}
	}
	return latest
}

// Insert or update VM state from System Monitor metrics
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

// Safe snapshot of all VMs for readers (threshold, dashboard, proxy)
func (m *Manager) GetAll() map[string]*VMState {
	m.mu.RLock()
	defer m.mu.RUnlock()

	out := make(map[string]*VMState, len(m.vms))
	for k, v := range m.vms {
		// shallow copy is OK because VMState fields are immutable primitives
		copied := *v
		out[k] = &copied
	}
	return out
}

