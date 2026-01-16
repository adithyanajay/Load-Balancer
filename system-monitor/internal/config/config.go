package config

import (
	"fmt"
	"os"
	"gopkg.in/yaml.v3"
)

type Config struct {
	VM          VMConfig          `yaml:"vm"`
	LoadBalancer LoadBalancerConfig `yaml:"loadbalancer"`
	Monitoring  MonitoringConfig  `yaml:"monitoring"`
	Weights     WeightsConfig     `yaml:"weights"`
	Network     NetworkConfig     `yaml:"network"`
}

type VMConfig struct {
	ID string `yaml:"id"`
}

type LoadBalancerConfig struct {
	URL             string `yaml:"url"`
	MetricsEndpoint string `yaml:"metrics_endpoint"`
	TimeoutSeconds  int    `yaml:"timeout_seconds"`
	RetryAttempts   int    `yaml:"retry_attempts"`
}

type MonitoringConfig struct {
	CollectionIntervalSeconds int `yaml:"collection_interval_seconds"`
	ReportIntervalSeconds     int `yaml:"report_interval_seconds"`
}

type WeightsConfig struct {
	CPU     float64 `yaml:"cpu"`
	Memory  float64 `yaml:"memory"`
	Network float64 `yaml:"network"`
}

type NetworkConfig struct {
	CapacityMbps float64 `yaml:"capacity_mbps"`
}

func Load(configPath string) (*Config, error) {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("failed to parse config file: %w", err)
	}

	if vmID := os.Getenv("VM_ID"); vmID != "" {
		config.VM.ID = vmID
	}

	if lbURL := os.Getenv("LOAD_BALANCER_URL"); lbURL != "" {
		config.LoadBalancer.URL = lbURL
	}

	if err := config.Validate(); err != nil {
		return nil, fmt.Errorf("invalid configuration: %w", err)
	}

	return &config, nil
}

func (c *Config) Validate() error {
	if c.VM.ID == "" {
		return fmt.Errorf("vm.id is required")
	}
	if c.LoadBalancer.URL == "" {
		return fmt.Errorf("loadbalancer.url is required")
	}
	if c.Weights.CPU+c.Weights.Memory+c.Weights.Network != 1.0 {
		return fmt.Errorf("weights must sum to 1.0")
	}
	return nil
}
