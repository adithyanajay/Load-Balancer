package state

import (
	"time"

	"load-balancer/internal/logger"
)

func (m *Manager) MarkSuspect(threshold time.Duration) {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now()

	for _, vm := range m.vms {
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
