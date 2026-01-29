package main

import (
	"time"
	"net/http"

	"github.com/gin-gonic/gin"

	"load-balancer/internal/dashboard"
	"load-balancer/internal/loadbalancer"
	"load-balancer/internal/monitor"
	"load-balancer/internal/state"
)

func main() {
	router := gin.Default()

	// Core state
	stateManager := state.NewManager()
	thresholdState := state.NewThresholdState()

	// Dashboard
	dashboardService := dashboard.NewService(stateManager, thresholdState)
	dashboardHub := dashboard.NewHub(dashboardService)
	dashboardHandler := dashboard.NewHandler(dashboardService)

	// Monitor
	monitorService := monitor.NewService(
		stateManager,
		thresholdState,
		dashboardHub, // 👈 broadcaster injected HERE
	)
	monitorHandler := monitor.NewHandler(monitorService)

	// Load balancer
	selector := loadbalancer.NewSelector(stateManager, thresholdState)
	lbHandler := loadbalancer.NewHandler(selector, stateManager)

	// Routes
	router.POST("/api/v1/metrics", monitorHandler.HandleMetrics)

	router.GET("/api/v1/dashboard/summary", dashboardHandler.GetSummary)
	router.GET("/api/v1/dashboard/vms", dashboardHandler.GetVMs)
	router.GET("/api/v1/dashboard/ws", gin.WrapH(http.HandlerFunc(dashboardHub.HandleWS)))

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

