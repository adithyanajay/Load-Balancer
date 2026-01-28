package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
	"github.com/adithyanajay/system-monitor/internal/config"
	"github.com/adithyanajay/system-monitor/internal/metrics"
	"github.com/adithyanajay/system-monitor/internal/reporter"
)

func main() {
	cfg, err := config.Load("config.yaml")
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	log.Printf("Starting System Monitor for VM: %s", cfg.VM.ID)
	log.Printf("Reporting to Load Balancer: %s", cfg.LoadBalancer.URL)

	aggregator := metrics.NewAggregator(cfg)
	rep := reporter.NewReporter(cfg)

	collectionTicker := time.NewTicker(time.Duration(cfg.Monitoring.CollectionIntervalSeconds) * time.Second)
	reportTicker := time.NewTicker(time.Duration(cfg.Monitoring.ReportIntervalSeconds) * time.Second)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	log.Println("System Monitor started successfully")

	go func() {
		for range collectionTicker.C {
			if err := aggregator.Collect(); err != nil {
				log.Printf("Error collecting metrics: %v", err)
			}
		}
	}()

	go func() {
		for range reportTicker.C {
			currentMetrics := aggregator.GetCurrentMetrics()
			if err := rep.Send(currentMetrics); err != nil {
				log.Printf("Error sending metrics: %v", err)
			} else {
				log.Printf("Metrics sent: Load=%.2f%% CPU=%.2f%% Mem=%.2f%% Net=%.2f%%",
					currentMetrics.LoadPercent,
					currentMetrics.CPUPercent,
					currentMetrics.MemoryPercent,
					currentMetrics.NetworkPercent)
			}
		}
	}()

	<-sigChan
	log.Println("Shutting down System Monitor...")

	collectionTicker.Stop()
	reportTicker.Stop()

	time.Sleep(1 * time.Second)
	log.Println("System Monitor stopped")
}
