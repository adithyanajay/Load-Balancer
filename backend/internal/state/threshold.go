package state

import (
	"sync"

	"load-balancer/internal/logger"
)

// LoadState values
const (
	LoadUnderload = "UNDERLOAD"
	LoadOverload  = "OVERLOAD"
)

// ThresholdState classifies VMs WITH hysteresis (sticky states)
type ThresholdState struct {
	mu sync.RWMutex

	// FIFO-preserved queues
	UnderloadQueue []string
	OverloadQueue  []string

	OverloadThreshold  float64
	UnderloadThreshold float64
}

func NewThresholdState() *ThresholdState {
	return &ThresholdState{
		OverloadThreshold:  75.0,
		UnderloadThreshold: 25.0,
	}
}

// ClassifyVMsByLoad uses hysteresis (stateful classification)
func (t *ThresholdState) ClassifyVMsByLoad(
	registeredVMs []*VMState,
) {
	t.mu.Lock()
	defer t.mu.Unlock()

	t.UnderloadQueue = []string{}
	t.OverloadQueue = []string{}

	for _, vm := range registeredVMs { // FIFO iteration

		if vm.Status != StatusActive {
			continue
		}

		load := vm.Metrics.LoadPercent

		switch vm.LoadState {

		case LoadUnderload:
			// Transition: UNDERLOAD → OVERLOAD
			if load >= t.OverloadThreshold {
				vm.LoadState = LoadOverload
			}

		case LoadOverload:
			// Transition: OVERLOAD → UNDERLOAD
			if load <= t.UnderloadThreshold {
				vm.LoadState = LoadUnderload
			}

		default:
			// Initial assignment (first time)
			if load >= t.OverloadThreshold {
				vm.LoadState = LoadOverload
			} else {
				vm.LoadState = LoadUnderload
			}
		}

		// Add to queues based on state
		if vm.LoadState == LoadUnderload {
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