package state

import "time"

type VMStatus string

const (
	StatusActive   VMStatus = "ACTIVE"
	StatusSuspect  VMStatus = "SUSPECT"
	StatusDisabled VMStatus = "DISABLED"
)

type Metrics struct {
	LoadPercent    float64
	CPUPercent     float64
	MemoryPercent  float64
	NetworkMbps    float64
	NetworkPercent float64
	Timestamp      time.Time
}

type VMState struct {
	VMID            string
	VMIP            string
	Status          VMStatus
	Metrics         Metrics
	LastReportedAt  time.Time
}

