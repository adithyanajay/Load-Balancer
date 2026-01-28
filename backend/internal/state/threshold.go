package state

import (
	"sort"
	"sync"

	"load-balancer/internal/logger"
)

type ThresholdState struct {
	mu sync.RWMutex

	Underload []string            // FIFO vm_id list
	Overload  []string            // priority vm_id list (lowest load first)

	UnderloadThreshold float64
	OverloadThreshold  float64
}

func NewThresholdState() *ThresholdState {
	return &ThresholdState{
		UnderloadThreshold: 25.0,
		OverloadThreshold:  75.0,
	}
}

func (t *ThresholdState) Recalculate(vms map[string]*VMState) {
	t.mu.Lock()
	defer t.mu.Unlock()

	t.Underload = []string{}
	t.Overload = []string{}

	for id, vm := range vms {
		if vm.Status != StatusActive {
			continue
		}

		if vm.Metrics.LoadPercent >= t.OverloadThreshold {
			t.Overload = append(t.Overload, id)
		} else {
			t.Underload = append(t.Underload, id)
		}
	}

	sort.Slice(t.Overload, func(i, j int) bool {
		return vms[t.Overload[i]].Metrics.LoadPercent <
			vms[t.Overload[j]].Metrics.LoadPercent
	})

	logger.ThresholdState(t.Underload, t.Overload)
}

func (t *ThresholdState) Snapshot() (under []string, over []string) {
	t.mu.RLock()
	defer t.mu.RUnlock()

	return append([]string{}, t.Underload...),
		append([]string{}, t.Overload...)
}

