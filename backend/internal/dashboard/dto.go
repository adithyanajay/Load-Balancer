package dashboard

import "time"

type DashboardSummary struct {
	TotalVMs     int `json:"total_vms"`
	ActiveVMs    int `json:"active_vms"`
	SuspectVMs   int `json:"suspect_vms"`
	StoppedVMs   int `json:"stopped_vms"`
	UnderloadVMs int `json:"underload_vms"`
	OverloadVMs  int `json:"overload_vms"`
	LastUpdate   time.Time `json:"last_update"`
}

type VMCard struct {
	VMID           string    `json:"vm_id"`
	VMIP           string    `json:"vm_ip"`
	Status         string    `json:"status"`
	LoadPercent    float64   `json:"load_percent"`
	CPUPercent     float64   `json:"cpu_percent"`
	MemoryPercent  float64   `json:"memory_percent"`
	NetworkPercent float64   `json:"network_percent"`
	LastReportedAt time.Time `json:"last_reported_at"`
}

