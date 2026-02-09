package monitor

import (
	"load-balancer/internal/dashboard"
	"load-balancer/internal/state"
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

func (s *Service) ProcessMetrics(req MetricsRequest, vmIP string) {
	s.state.UpsertFromMetrics(
		req.InstanceID,
		vmIP,
		state.Metrics{
			LoadPercent:    req.Metrics.LoadPercent,
			CPUPercent:     req.Metrics.CPUPercent,
			MemoryPercent:  req.Metrics.MemoryPercent,
			NetworkMbps:    req.Metrics.NetworkMbps,
			NetworkPercent: req.Metrics.NetworkPercent,
			Timestamp:      req.Metrics.Timestamp,
		},
	)

	s.threshold.Recalculate(s.state.GetAll())
	s.hub.PushUpdate()
}
