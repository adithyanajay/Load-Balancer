package monitor

import "time"

type MetricsRequest struct {
	VMID           string    `json:"vm_id"`
	VMIP           string    `json:"vm_ip"`
	Timestamp      time.Time `json:"timestamp"`
	LoadPercent    float64   `json:"load_percent"`
	CPUPercent     float64   `json:"cpu_percent"`
	MemoryPercent  float64   `json:"memory_percent"`
	NetworkMbps    float64   `json:"network_mbps"`
	NetworkPercent float64   `json:"network_percent"`
}

