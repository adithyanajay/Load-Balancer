package monitor

import (

	"load-balancer/internal/state"
	"load-balancer/internal/dashboard"
)

type Service struct {
	state     *state.Manager
	threshold *state.ThresholdState
	hub       *dashboard.Hub
}

func NewService(
	sm *state.Manager,
	ts *state.ThresholdState,
	h *dashboard.Hub,
) *Service {
	return &Service{
		state:     sm,
		threshold: ts,
		hub:       h,
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
	s.hub.PushUpdate()
}

