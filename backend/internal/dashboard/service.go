package dashboard

import "load-balancer/internal/state"

type Service struct {
	state     *state.Manager
	threshold *state.ThresholdState
}

func NewService(sm *state.Manager, ts *state.ThresholdState) *Service {
	return &Service{
		state:     sm,
		threshold: ts,
	}
}

/*
Summary data for top dashboard cards
*/
type Summary struct {
	TotalVMs     int
	ActiveVMs    int
	SuspectVMs   int
	DisabledVMs  int
	UnderloadVMs int
	OverloadVMs  int
	LastUpdate   int64
}

func (s *Service) Summary() Summary {
	return Summary{
		TotalVMs:     s.state.Total(),
		ActiveVMs:    s.state.CountByStatus(state.StatusActive),
		SuspectVMs:   s.state.CountByStatus(state.StatusSuspect),
		DisabledVMs:  s.state.CountByStatus(state.StatusDisabled),
		UnderloadVMs: s.threshold.UnderloadCount(),
		OverloadVMs:  s.threshold.OverloadCount(),
		LastUpdate:   s.state.LastUpdate().Unix(),
	}
}

/*
VM list for cards
*/
func (s *Service) VMList() map[string]*state.VMState {
	return s.state.GetAll()
}

