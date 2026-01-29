package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"load-balancer/internal/dashboard"
	"load-balancer/internal/loadbalancer"
	"load-balancer/internal/monitor"
	"load-balancer/internal/state"
)

/*
	CORS middleware
	IMPORTANT:
	- OPTIONS must NEVER reach the VM
	- Load balancer must answer preflight itself
*/
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func main() {
	router := gin.Default()

	// ✅ APPLY CORS FIRST
	router.Use(CORSMiddleware())

	// ---------------- CORE STATE ----------------
	stateManager := state.NewManager()
	thresholdState := state.NewThresholdState()

	// ---------------- DASHBOARD ----------------
	dashboardService := dashboard.NewService(stateManager, thresholdState)
	dashboardHub := dashboard.NewHub(dashboardService)
	dashboardHandler := dashboard.NewHandler(dashboardService)

	// ---------------- MONITOR ----------------
	monitorService := monitor.NewService(
		stateManager,
		thresholdState,
		dashboardHub, // pushes WS updates
	)
	monitorHandler := monitor.NewHandler(monitorService)

	// ---------------- LOAD BALANCER ----------------
	selector := loadbalancer.NewSelector(stateManager, thresholdState)
	lbHandler := loadbalancer.NewHandler(selector, stateManager)

	// ---------------- ROUTES ----------------

	// Metrics from system monitor
	router.POST("/api/v1/metrics", monitorHandler.HandleMetrics)

	// Dashboard APIs
	router.GET("/api/v1/dashboard/summary", dashboardHandler.GetSummary)
	router.GET("/api/v1/dashboard/vms", dashboardHandler.GetVMs)
	router.GET(
		"/api/v1/dashboard/ws",
		gin.WrapH(http.HandlerFunc(dashboardHub.HandleWS)),
	)

	// 🚨 IMPORTANT:
	// Client traffic MUST be explicitly routed
	router.Any("/api/v1/load", lbHandler.HandleRequest)

	// ❌ Never proxy unknown routes
	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "route not found",
		})
	})

	// ---------------- STALENESS REAPER ----------------
	go func() {
		ticker := time.NewTicker(10 * time.Second)
		for range ticker.C {
			stateManager.MarkSuspect(60 * time.Second)
		}
	}()

	// ---------------- START SERVER ----------------
	router.Run(":8080")
}

