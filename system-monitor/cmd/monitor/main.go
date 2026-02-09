package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/adithyanajay/system-monitor/internal/config"
	"github.com/adithyanajay/system-monitor/internal/identity"
	"github.com/adithyanajay/system-monitor/internal/metrics"
	"github.com/adithyanajay/system-monitor/internal/models"
	"github.com/adithyanajay/system-monitor/internal/reporter"
)

func main() {
	cfg, _ := config.Load("config.yaml")

	instanceID, err := identity.GetInstanceID()
	if err != nil {
		log.Fatal(err)
	}

	aggregator := metrics.NewAggregator(cfg)
	rep := reporter.NewReporter(cfg)

	collect := time.NewTicker(time.Duration(cfg.Monitoring.CollectionIntervalSeconds) * time.Second)
	report := time.NewTicker(time.Duration(cfg.Monitoring.ReportIntervalSeconds) * time.Second)

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		for range collect.C {
			_ = aggregator.Collect()
		}
	}()

	go func() {
		for range report.C {
			m := aggregator.GetCurrentMetrics()
			payload := models.MetricsPayload{
				InstanceID: instanceID,
				Metrics:    *m,
			}
			_ = rep.Send(payload)
		}
	}()

	<-sig
	log.Println("System Monitor stopped")
}
