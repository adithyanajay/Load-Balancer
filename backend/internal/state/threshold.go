package state

import (
	"sync"

	"load-balancer/internal/logger"
)

// ThresholdState classifies VMs WITHOUT changing order
type ThresholdState struct {
	mu sync.RWMutex

	// FIFO-preserved queues
	UnderloadQueue []string
	OverloadQueue  []string

	OverloadThreshold float64
}

func NewThresholdState() *ThresholdState {
	return &ThresholdState{
		OverloadThreshold: 75.0,
	}
}

// ClassifyVMsByLoad filters VMs but preserves FIFO order
func (t *ThresholdState) ClassifyVMsByLoad(
	registeredVMs []*VMState,
) {
	t.mu.Lock()
	defer t.mu.Unlock()

	t.UnderloadQueue = []string{}
	t.OverloadQueue = []string{}

	for _, vm := range registeredVMs { // 🔥 FIFO ITERATION
		if vm.Status != StatusActive {
			continue
		}

		if vm.Metrics.LoadPercent < t.OverloadThreshold {
			t.UnderloadQueue = append(t.UnderloadQueue, vm.InstanceID)
		} else {
			t.OverloadQueue = append(t.OverloadQueue, vm.InstanceID)
		}
	}

	logger.ThresholdState(t.UnderloadQueue, t.OverloadQueue)
}

// Snapshot helpers (used by selector & dashboard)
func (t *ThresholdState) Snapshot() (under []string, over []string) {
	t.mu.RLock()
	defer t.mu.RUnlock()

	under = append([]string{}, t.UnderloadQueue...)
	over = append([]string{}, t.OverloadQueue...)
	return
}

func (t *ThresholdState) UnderloadCount() int {
	t.mu.RLock()
	defer t.mu.RUnlock()
	return len(t.UnderloadQueue)
}

func (t *ThresholdState) OverloadCount() int {
	t.mu.RLock()
	defer t.mu.RUnlock()
	return len(t.OverloadQueue)
}
