package main

import (
	"time"

	"github.com/gin-gonic/gin"
	"load-balancer/internal/monitor"
	"load-balancer/internal/state"
	"load-balancer/internal/loadbalancer"
)

func main() {
	router := gin.Default()

	stateManager := state.NewManager()
	thresholdState := state.NewThresholdState()

	monitorService := monitor.NewService(stateManager, thresholdState)
	monitorHandler := monitor.NewHandler(monitorService)

	selector := loadbalancer.NewSelector(stateManager, thresholdState)
	lbHandler := loadbalancer.NewHandler(selector, stateManager)

	router.POST("/api/v1/metrics", monitorHandler.HandleMetrics)
	// router.Any("/*path", lbHandler.HandleRequest)

	router.NoRoute(lbHandler.HandleRequest)

	// Staleness reaper
	go func() {
		ticker := time.NewTicker(10 * time.Second)
		for range ticker.C {
			stateManager.MarkSuspect(60 * time.Second)
		}
	}()

	router.Run(":8080")
}

