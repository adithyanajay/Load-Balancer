package state

import (
	"sync"
	"time"

	"load-balancer/internal/logger"
)

type Manager struct {
	mu  sync.RWMutex
	vms map[string]*VMState // key = instance_id
}

func NewManager() *Manager {
	return &Manager{
		vms: make(map[string]*VMState),
	}
}

func (m *Manager) Total() int {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return len(m.vms)
}

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
	instanceID string,
	vmIP string,
	metrics Metrics,
) {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now()

	vm, exists := m.vms[instanceID]
	if !exists {
		m.vms[instanceID] = &VMState{
			InstanceID:     instanceID,
			VMIP:           vmIP,
			Status:         StatusActive,
			Metrics:        metrics,
			LastReportedAt: now,
		}

		logger.Info("New VM registered: " + instanceID)
		logger.MetricsUpdate(instanceID, metrics.LoadPercent)
		return
	}

	prevState := vm.Status

	vm.VMIP = vmIP
	vm.Metrics = metrics
	vm.LastReportedAt = now
	vm.Status = StatusActive

	if prevState != StatusActive {
		logger.StateChange(instanceID, string(prevState), string(StatusActive))
	}

	logger.MetricsUpdate(instanceID, metrics.LoadPercent)
}

func (m *Manager) GetAll() map[string]*VMState {
	m.mu.RLock()
	defer m.mu.RUnlock()

	out := make(map[string]*VMState, len(m.vms))
	for k, v := range m.vms {
		copied := *v
		out[k] = &copied
	}
	return out
}
