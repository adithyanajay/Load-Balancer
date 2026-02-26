package autoscaler

import (
	"context"
	"log"
	"time"

	"load-balancer/internal/state"
)

type Service struct {
	state        *state.Manager
	threshold    *state.ThresholdState
	autoState    *state.AutoscalerState
	awsClient    *Client
	lbInstanceID string
}

func NewService(
	sm *state.Manager,
	ts *state.ThresholdState,
	as *state.AutoscalerState,
	aws *Client,
	lbID string,
) *Service {
	return &Service{
		state:        sm,
		threshold:    ts,
		autoState:    as,
		awsClient:    aws,
		lbInstanceID: lbID,
	}
}

func (s *Service) Start(ctx context.Context) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.evaluateScaleUp()
			s.evaluateScaleDown()
		case <-ctx.Done():
			return
		}
	}
}

func (s *Service) evaluateScaleUp() {
	if !s.autoState.CanScale() {
		return
	}

	underCount := s.threshold.UnderloadCount()
	active := s.state.ActiveCount()
	_, max, upCount, _ := s.autoState.GetConfig()

	if underCount <= 1 && active < max {
		allowed := max - active
		if allowed <= 0 {
			return
		}

		if upCount > allowed {
			upCount = allowed
		}

		// First start stopped instances
		stopped, err := s.awsClient.GetStoppedInstances()
		if err == nil && len(stopped) > 0 {
			toStart := stopped
			if len(toStart) > upCount {
				toStart = toStart[:upCount]
			}
			s.awsClient.StartInstances(toStart)
			log.Println("Started stopped instances:", toStart)
			s.autoState.MarkScaled()
			return
		}

		// Otherwise launch new
		err = s.awsClient.LaunchInstances(int32(upCount))
		if err == nil {
			log.Println("Launched new instances:", upCount)
			s.autoState.MarkScaled()
		}
	}
}

func (s *Service) evaluateScaleDown() {
	if !s.autoState.CanScale() {
		return
	}

	_, over := s.threshold.Snapshot()
	if len(over) > 0 {
		return
	}

	active := s.state.ActiveCount()
	min, _, _, downCount := s.autoState.GetConfig()

	if active <= min {
		return
	}

	vms := s.state.GetVMsInRegistrationOrder()

	// Check all load < 20%
	for _, vm := range vms {
		if vm.Metrics.LoadPercent >= 20 {
			return
		}
	}

	stopped := 0
	for i := len(vms) - 1; i >= 0 && stopped < downCount; i-- {
		vm := vms[i]

		if vm.InstanceID == s.lbInstanceID {
			continue
		}

		err := s.awsClient.StopInstance(vm.InstanceID)
		if err == nil {
			s.state.RemoveVM(vm.InstanceID)
			log.Println("Stopped instance:", vm.InstanceID)
			stopped++
		}
	}

	if stopped > 0 {
		s.autoState.MarkScaled()
	}
}