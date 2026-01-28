package loadbalancer

import (
	"errors"
	"load-balancer/internal/state"
)

type Selector struct {
	threshold *state.ThresholdState
	state     *state.Manager
}

func NewSelector(sm *state.Manager, ts *state.ThresholdState) *Selector {
	return &Selector{state: sm, threshold: ts}
}

func (s *Selector) SelectVM() (string, error) {
	under, over := s.threshold.Snapshot()

	if len(under) > 0 {
		return under[0], nil
	}

	if len(over) > 0 {
		return over[0], nil
	}

	return "", errors.New("no active VM available")
}

