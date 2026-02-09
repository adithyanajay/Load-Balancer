package state

import (
	"sync"
	"time"

	"load-balancer/internal/logger"
)

// Manager is the single source of truth for all VM state
type Manager struct {
	mu sync.RWMutex

	// All VMs indexed by instance_id
	vmByID map[string]*VMState

	// FIFO registration order (first seen = first served)
	registrationOrder []string
}

func NewManager() *Manager {
	return &Manager{
		vmByID:           make(map[string]*VMState),
		registrationOrder: []string{},
	}
}

// ============================
// WRITE PATH (FIFO logic)
// ============================

// RegisterOrUpdateVM is called on every metrics POST
// FIFO is decided ONLY when a VM is first registered
func (m *Manager) RegisterOrUpdateVM(
	instanceID string,
	vmIP string,
	metrics Metrics,
) {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now()

	vm, exists := m.vmByID[instanceID]

	// First time registration → FIFO append
	if !exists {
		vm = &VMState{
			InstanceID:     instanceID,
			VMIP:           vmIP,
			Status:         StatusActive,
			Metrics:        metrics,
			LastReportedAt: now,
		}

		m.vmByID[instanceID] = vm
		m.registrationOrder = append(m.registrationOrder, instanceID)

		logger.Info("VM registered (FIFO append): " + instanceID)
		logger.MetricsUpdate(instanceID, metrics.LoadPercent)
		return
	}

	// Existing VM → update only
	prevStatus := vm.Status

	vm.VMIP = vmIP
	vm.Metrics = metrics
	vm.LastReportedAt = now
	vm.Status = StatusActive

	if prevStatus != StatusActive {
		logger.StateChange(instanceID, string(prevStatus), string(StatusActive))
	}

	logger.MetricsUpdate(instanceID, metrics.LoadPercent)
}

// ============================
// READ PATH (safe helpers)
// ============================

// GetVMByID returns a VM by instance_id (used by proxy)
func (m *Manager) GetVMByID(instanceID string) *VMState {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.vmByID[instanceID]
}

// GetAll returns a safe snapshot of all VMs (unordered)
func (m *Manager) GetAll() map[string]*VMState {
	m.mu.RLock()
	defer m.mu.RUnlock()

	out := make(map[string]*VMState, len(m.vmByID))
	for k, v := range m.vmByID {
		copied := *v
		out[k] = &copied
	}
	return out
}

// GetVMsInRegistrationOrder returns VMs in FIFO order
func (m *Manager) GetVMsInRegistrationOrder() []*VMState {
	m.mu.RLock()
	defer m.mu.RUnlock()

	result := make([]*VMState, 0, len(m.registrationOrder))
	for _, id := range m.registrationOrder {
		result = append(result, m.vmByID[id])
	}
	return result
}

// ============================
// DASHBOARD HELPERS
// ============================

// Total number of VMs ever registered
func (m *Manager) Total() int {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return len(m.vmByID)
}

// CountByStatus counts VMs by status
func (m *Manager) CountByStatus(status VMStatus) int {
	m.mu.RLock()
	defer m.mu.RUnlock()

	count := 0
	for _, vm := range m.vmByID {
		if vm.Status == status {
			count++
		}
	}
	return count
}

// LastUpdate returns latest metrics timestamp
func (m *Manager) LastUpdate() time.Time {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var latest time.Time
	for _, vm := range m.vmByID {
		if vm.LastReportedAt.After(latest) {
			latest = vm.LastReportedAt
		}
	}
	return latest
}
