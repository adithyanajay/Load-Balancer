package main

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"load-balancer/internal/autoscaler" // ✅ NEW
	"load-balancer/internal/dashboard"
	"load-balancer/internal/loadbalancer"
	"load-balancer/internal/monitor"
	"load-balancer/internal/state"
)

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

	router.Use(CORSMiddleware())

	// ---------------- CORE STATE ----------------
	stateManager := state.NewManager()
	thresholdState := state.NewThresholdState()

	// ✅ AUTOSCALER STATE
	autoState := state.NewAutoscalerState()

	// ---------------- DASHBOARD ----------------
	dashboardService := dashboard.NewService(stateManager, thresholdState)
	dashboardHub := dashboard.NewHub(dashboardService)
	dashboardHandler := dashboard.NewHandler(dashboardService)

	// ---------------- MONITOR ----------------
	monitorService := monitor.NewService(
		stateManager,
		thresholdState,
		dashboardHub,
	)
	monitorHandler := monitor.NewHandler(monitorService)

	// ---------------- LOAD BALANCER ----------------
	selector := loadbalancer.NewSelector(stateManager, thresholdState)
	lbHandler := loadbalancer.NewHandler(selector, stateManager)

	// ---------------- AUTOSCALER AWS CONFIG ----------------
	launchCfg := autoscaler.LaunchConfig{
		Region:        "us-east-1",
		AMI:           "ami-0b6c6ebed2801a5cb",
		InstanceType:  "t3.medium",
		SubnetID:      "subnet-01ca07e9ad7c99066",
		SecurityGroup: "sg-04ebfeb94a9831195",
		KeyName:       "lb",
	}

	awsClient, err := autoscaler.NewClient(launchCfg)
	if err != nil {
		panic(err)
	}

	// Load Balancer Instance ID (hardcoded fallback)
	lbInstanceID := "i-03c98352c66118c1d"

	autoscalerService := autoscaler.NewService(
		stateManager,
		thresholdState,
		autoState,
		awsClient,
		lbInstanceID,
	)
	adminHandler := autoscaler.NewAdminHandler(
		autoState,
		stateManager,
		awsClient,
		lbInstanceID,
	)

	// ✅ START AUTOSCALER LOOP
	go autoscalerService.Start(context.Background())

	// ---------------- ROUTES ----------------

	// Autoscaler Admin APIs
	autoscaler.RegisterAdminRoutes(router, adminHandler)

	router.POST("/api/v1/metrics", monitorHandler.HandleMetrics)

	router.GET("/api/v1/dashboard/summary", dashboardHandler.GetSummary)
	router.GET("/api/v1/dashboard/vms", dashboardHandler.GetVMs)
	router.GET(
		"/api/v1/dashboard/ws",
		gin.WrapH(http.HandlerFunc(dashboardHub.HandleWS)),
	)

	router.Any("/api/v1/load", lbHandler.HandleRequest)

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

	router.Run(":8080")
}