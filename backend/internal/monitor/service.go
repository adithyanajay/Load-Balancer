package monitor

import (

	"load-balancer/internal/state"
)

type Service struct {
	state *state.Manager
	threshold *state.ThresholdState
}



func NewService(sm *state.Manager, ts *state.ThresholdState) *Service {
	return &Service{
		state:     sm,
		threshold: ts,
	}
}

func (s *Service) ProcessMetrics(req MetricsRequest) {
	s.state.UpsertFromMetrics(
		req.VMID,
		req.VMIP,
		state.Metrics{
			LoadPercent:    req.LoadPercent,
			CPUPercent:     req.CPUPercent,
			MemoryPercent:  req.MemoryPercent,
			NetworkMbps:    req.NetworkMbps,
			NetworkPercent: req.NetworkPercent,
			Timestamp:      req.Timestamp,
		},
	)

	s.threshold.Recalculate(s.state.GetAll())
}

