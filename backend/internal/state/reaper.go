package state

import (
	"time"

	"load-balancer/internal/logger"
)

// MarkSuspect marks VMs as SUSPECT if they stop reporting metrics
func (m *Manager) MarkSuspect(threshold time.Duration) {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now()

	// Iterate over ALL known VMs
	for _, vm := range m.vmByID {
		if vm.Status == StatusDisabled {
			continue
		}

		if now.Sub(vm.LastReportedAt) > threshold {
			if vm.Status != StatusSuspect {
				logger.StateChange(
					vm.InstanceID,
					string(vm.Status),
					string(StatusSuspect),
				)
				vm.Status = StatusSuspect
			}
		}
	}
}
