package monitor

import "time"

type MetricsRequest struct {
	InstanceID string `json:"instance_id"`

	Metrics struct {
		Timestamp      time.Time `json:"timestamp"`
		LoadPercent    float64   `json:"load_percent"`
		CPUPercent     float64   `json:"cpu_percent"`
		MemoryPercent  float64   `json:"memory_percent"`
		NetworkMbps    float64   `json:"network_mbps"`
		NetworkPercent float64   `json:"network_percent"`
	} `json:"metrics"`
}
