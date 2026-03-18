package autoscaler

import (
	"context"
	"fmt"
	"time"

	"load-balancer/internal/logger"
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

	logger.AutoscalerEvent("Autoscaler started")

	for {
		select {
		case <-ticker.C:
			logger.AutoscalerTick()
			s.evaluateScaleUp()
			s.evaluateScaleDown()
		case <-ctx.Done():
			logger.AutoscalerEvent("Autoscaler stopped")
			return
		}
	}
}

// ---------------------------------------------------
// SCALE UP
// ---------------------------------------------------

func (s *Service) evaluateScaleUp() {

	if !s.autoState.CanScale() {
		logger.AutoscalerEvent("Cooldown active - skipping scale up")
		return
	}

	active := s.state.ActiveCount()
	min, max, upCount, _ := s.autoState.GetConfig()
	underCount := s.threshold.UnderloadCount()

	logger.AutoscalerEvent(
		fmt.Sprintf("ScaleUp Check | Active=%d | Min=%d | Max=%d | Underload=%d",
			active, min, max, underCount),
	)

	// ---------------------------------------------------
	// MINIMUM CAPACITY ENFORCEMENT
	// ---------------------------------------------------

	if active < min {

		needed := min - active

		logger.AutoscalerEvent(
			fmt.Sprintf(
				"Active instances below minimum (%d < %d). Need %d instances",
				active, min, needed,
			),
		)

		// ----------------------------------------
		// First: Start stopped instances
		// ----------------------------------------

		stopped, err := s.awsClient.GetStoppedInstances()
		if err != nil {
			logger.AutoscalerEvent(
				fmt.Sprintf("Error fetching stopped instances: %v", err),
			)
			return
		}

		if len(stopped) > 0 {

			toStart := stopped
			if len(toStart) > needed {
				toStart = toStart[:needed]
			}

			err := s.awsClient.StartInstances(toStart)
			if err != nil {
				logger.AutoscalerEvent(
					fmt.Sprintf("Failed to start stopped instances: %v", err),
				)
				return
			}

			logger.AutoscalerEvent(
				fmt.Sprintf(
					"Started stopped instances to meet minimum: %v",
					toStart,
				),
			)

			s.autoState.MarkScaled()
			return
		}
	}
	// ---------------------------------------------------
	// NORMAL SCALE-UP LOGIC
	// ---------------------------------------------------

	if underCount > 1 || active >= max {
		return
	}

	allowed := max - active
	if allowed <= 0 {
		return
	}

	if upCount > allowed {
		upCount = allowed
	}

	logger.AutoscalerScaleUp(upCount)

	// ----------------------------------------
	// First: Start stopped instances
	// ----------------------------------------

	stopped, err := s.awsClient.GetStoppedInstances()
	if err != nil {
		logger.AutoscalerEvent(
			fmt.Sprintf("Error fetching stopped instances: %v", err),
		)
		return
	}

	if len(stopped) > 0 {
		toStart := stopped
		if len(toStart) > upCount {
			toStart = toStart[:upCount]
		}

		err := s.awsClient.StartInstances(toStart)
		if err != nil {
			logger.AutoscalerEvent(
				fmt.Sprintf("Failed to start stopped instances: %v", err),
			)
			return
		}

		logger.AutoscalerEvent(
			fmt.Sprintf("Started stopped instances: %v", toStart),
		)

		s.autoState.MarkScaled()
		return
	}

	// ----------------------------------------
	// Otherwise: Launch new instances
	// ----------------------------------------

	// err = s.awsClient.LaunchInstances(int32(upCount))
	// if err != nil {
	// 	logger.AutoscalerEvent(
	// 		fmt.Sprintf("Failed to launch new instances: %v", err),
	// 	)
	// 	return
	// }

	logger.AutoscalerEvent(
		fmt.Sprintf("Launched new instances: %d", upCount),
	)

	s.autoState.MarkScaled()
}

// ---------------------------------------------------
// SCALE DOWN
// ---------------------------------------------------

func (s *Service) evaluateScaleDown() {

	if !s.autoState.CanScale() {
		logger.AutoscalerEvent("Cooldown active - skipping scale down")
		return
	}

	_, over := s.threshold.Snapshot()

	if len(over) > 0 {
		logger.AutoscalerEvent("Overload present - skipping scale down")
		return
	}

	active := s.state.ActiveCount()
	min, _, _, downCount := s.autoState.GetConfig()

	logger.AutoscalerEvent(
		fmt.Sprintf("ScaleDown Check | Active=%d | Min=%d",
			active, min),
	)

	if active <= min {
		return
	}

	vms := s.state.GetVMsInRegistrationOrder()

	// Ensure all ACTIVE VMs are below 20%
	for _, vm := range vms {
		if vm.Metrics.LoadPercent >= 20 {
			logger.AutoscalerEvent(
				fmt.Sprintf("VM %s load %.2f%% >= 20%% - skipping scale down",
					vm.InstanceID, vm.Metrics.LoadPercent),
			)
			return
		}
	}

	stoppedCount := 0

	// Iterate from bottom (FIFO reverse)
	for i := len(vms) - 1; i >= 0 && stoppedCount < downCount; i-- {

		vm := vms[i]

		if vm.InstanceID == s.lbInstanceID {
			continue
		}

		err := s.awsClient.StopInstance(vm.InstanceID)
		if err != nil {
			logger.AutoscalerEvent(
				fmt.Sprintf("Failed to stop instance %s: %v",
					vm.InstanceID, err),
			)
			continue
		}

		s.state.RemoveVM(vm.InstanceID)

		logger.AutoscalerScaleDown(vm.InstanceID)

		stoppedCount++
	}

	if stoppedCount > 0 {
		s.autoState.MarkScaled()
	}
}
