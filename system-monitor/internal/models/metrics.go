package models

import "time"

// Metrics represents pure telemetry data reported by a VM.
// It does NOT contain identity or addressing information.
type Metrics struct {
	Timestamp      time.Time `json:"timestamp"`
	LoadPercent    float64   `json:"load_percent"`
	CPUPercent     float64   `json:"cpu_percent"`
	MemoryPercent  float64   `json:"memory_percent"`
	NetworkMbps    float64   `json:"network_mbps"`
	NetworkPercent float64   `json:"network_percent"`
}

// MetricsPayload is the envelope sent by the System Monitor.
// Identity lives here, not inside Metrics.
type MetricsPayload struct {
	InstanceID string  `json:"instance_id"`
	Metrics    Metrics `json:"metrics"`
}

// --- Optional internal-only structs (unchanged) ---

type CPUStats struct {
	User         uint64
	Nice         uint64
	System       uint64
	Idle         uint64
	IOWait       uint64
	Total        uint64
	UsagePercent float64
}

type MemoryStats struct {
	Total        uint64
	Available    uint64
	Used         uint64
	UsagePercent float64
}

type NetworkStats struct {
	RxBytes        uint64
	TxBytes        uint64
	TotalBytes     uint64
	ThroughputMbps float64
	UsagePercent   float64
}

