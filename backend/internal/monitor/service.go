package monitor

import (
	"load-balancer/internal/dashboard"
	"load-balancer/internal/state"
)

// Service wires metrics → state → threshold → dashboard
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

// ProcessMetrics is called on EVERY /metrics POST
func (s *Service) ProcessMetrics(
	req MetricsRequest,
	vmIP string,
) {
	// 1️⃣ Register or update VM (FIFO decided HERE)
	s.state.RegisterOrUpdateVM(
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

	// 2️⃣ Fetch VMs in FIFO registration order
	registeredVMs := s.state.GetVMsInRegistrationOrder()

	// 3️⃣ Classify underload / overload (ORDER PRESERVED)
	s.threshold.ClassifyVMsByLoad(registeredVMs)

	// 4️⃣ Push update to dashboard
	s.hub.PushUpdate()
}
