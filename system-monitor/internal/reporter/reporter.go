package reporter

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/adithyanajay/system-monitor/internal/config"
	"github.com/adithyanajay/system-monitor/internal/models"
)

type Reporter struct {
	config     *config.Config
	httpClient *http.Client
	endpoint   string
}

func NewReporter(cfg *config.Config) *Reporter {
	return &Reporter{
		config: cfg,
		httpClient: &http.Client{
			Timeout: time.Duration(cfg.LoadBalancer.TimeoutSeconds) * time.Second,
		},
		endpoint: cfg.LoadBalancer.URL + cfg.LoadBalancer.MetricsEndpoint,
	}
}

// Send sends the full MetricsPayload (instance_id + metrics)
func (r *Reporter) Send(payload models.MetricsPayload) error {
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal metrics payload: %w", err)
	}

	var lastErr error
	for attempt := 1; attempt <= r.config.LoadBalancer.RetryAttempts; attempt++ {
		req, err := http.NewRequest("POST", r.endpoint, bytes.NewBuffer(jsonData))
		if err != nil {
			return fmt.Errorf("failed to create request: %w", err)
		}

		req.Header.Set("Content-Type", "application/json")

		resp, err := r.httpClient.Do(req)
		if err != nil {
			lastErr = err
			log.Printf("Attempt %d failed: %v", attempt, err)

			if attempt < r.config.LoadBalancer.RetryAttempts {
				time.Sleep(2 * time.Second)
				continue
			}
			return fmt.Errorf("failed to send metrics after %d attempts: %w", attempt, err)
		}
		defer resp.Body.Close()

		if resp.StatusCode >= 200 && resp.StatusCode < 300 {
			return nil
		}

		lastErr = fmt.Errorf("received status code %d", resp.StatusCode)
		log.Printf("Attempt %d received status code: %d", attempt, resp.StatusCode)

		if attempt < r.config.LoadBalancer.RetryAttempts {
			time.Sleep(2 * time.Second)
		}
	}

	return fmt.Errorf(
		"failed to send metrics after %d attempts: %w",
		r.config.LoadBalancer.RetryAttempts,
		lastErr,
	)
}
