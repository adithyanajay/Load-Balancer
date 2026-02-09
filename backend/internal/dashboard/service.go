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

/*
Queues for FIFO visualization
*/
type Queues struct {
	FIFO      []string `json:"fifo"`
	Underload []string `json:"underload"`
	Overload  []string `json:"overload"`
}

func (s *Service) BuildQueues() Queues {
	// FIFO from registration order
	registered := s.state.GetVMsInRegistrationOrder()
	fifo := make([]string, 0, len(registered))

	for _, vm := range registered {
		fifo = append(fifo, vm.InstanceID)
	}

	// Underload / Overload from threshold
	under, over := s.threshold.Snapshot()

	return Queues{
		FIFO:      fifo,
		Underload: under,
		Overload:  over,
	}
}

/*
Full dashboard snapshot (used by WebSocket)
*/
func (s *Service) Snapshot() map[string]interface{} {
	return map[string]interface{}{
		"summary": s.Summary(),
		"vms":     s.VMList(),
		"queues":  s.BuildQueues(),
	}
}
