package state

import (
	"sync"
	"time"
)

type AutoscalerState struct {
	mu sync.RWMutex

	MinInstances   int
	MaxInstances   int
	ScaleUpCount   int
	ScaleDownCount int
	Cooldown       time.Duration

	LastScaleTime time.Time
}

func NewAutoscalerState() *AutoscalerState {
	return &AutoscalerState{
		MinInstances:   2,
		MaxInstances:   10,
		ScaleUpCount:   2,
		ScaleDownCount: 1,
		Cooldown:       5 * time.Second,
		LastScaleTime:  time.Time{},
	}
}

func (a *AutoscalerState) CanScale() bool {
	a.mu.RLock()
	defer a.mu.RUnlock()

	return time.Since(a.LastScaleTime) >= a.Cooldown
}

func (a *AutoscalerState) MarkScaled() {
	a.mu.Lock()
	defer a.mu.Unlock()
	a.LastScaleTime = time.Now()
}

func (a *AutoscalerState) GetConfig() (min, max, up, down int) {
	a.mu.RLock()
	defer a.mu.RUnlock()
	return a.MinInstances, a.MaxInstances, a.ScaleUpCount, a.ScaleDownCount
}





func (a *AutoscalerState) UpdateConfig(
	min int,
	max int,
	up int,
	down int,
	cooldown time.Duration,
) {
	a.mu.Lock()
	defer a.mu.Unlock()

	a.MinInstances = min
	a.MaxInstances = max
	a.ScaleUpCount = up
	a.ScaleDownCount = down
	a.Cooldown = cooldown
}




