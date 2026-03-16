package autoscaler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"load-balancer/internal/logger"
	"load-balancer/internal/state"
)

type AdminHandler struct {
	autoState    *state.AutoscalerState
	manager      *state.Manager
	awsClient    *Client
	lbInstanceID string
}

func NewAdminHandler(
	as *state.AutoscalerState,
	sm *state.Manager,
	aws *Client,
	lbID string,
) *AdminHandler {
	return &AdminHandler{
		autoState:    as,
		manager:      sm,
		awsClient:    aws,
		lbInstanceID: lbID,
	}
}

type ConfigRequest struct {
	MinInstances   int `json:"min_instances"`
	MaxInstances   int `json:"max_instances"`
	ScaleUpCount   int `json:"scale_up_count"`
	ScaleDownCount int `json:"scale_down_count"`
	CooldownSec    int `json:"cooldown_seconds"`
}

type ConfigResponse struct {
	MinInstances   int `json:"min_instances"`
	MaxInstances   int `json:"max_instances"`
	ScaleUpCount   int `json:"scale_up_count"`
	ScaleDownCount int `json:"scale_down_count"`
	CooldownSec    int `json:"cooldown_seconds"`
}

func (h *AdminHandler) GetAutoscalerConfig(c *gin.Context) {

	min, max, up, down := h.autoState.GetConfig()

	resp := ConfigResponse{
		MinInstances:   min,
		MaxInstances:   max,
		ScaleUpCount:   up,
		ScaleDownCount: down,
		CooldownSec:    int(h.autoState.Cooldown.Seconds()),
	}

	c.JSON(http.StatusOK, resp)
}

func (h *AdminHandler) UpdateAutoscalerConfig(c *gin.Context) {

	var req ConfigRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	// ---------- Validation ----------

	if req.MinInstances < 1 || req.MinInstances > 10 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "min_instances must be between 1 and 10"})
		return
	}

	if req.MaxInstances < 2 || req.MaxInstances > 10 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "max_instances must be between 2 and 10"})
		return
	}

	if req.MinInstances > req.MaxInstances {
		c.JSON(http.StatusBadRequest, gin.H{"error": "min_instances cannot be greater than max_instances"})
		return
	}

	if req.ScaleUpCount < 1 || req.ScaleUpCount > req.MaxInstances {
		c.JSON(http.StatusBadRequest, gin.H{"error": "scale_up_count invalid"})
		return
	}

	if req.ScaleDownCount < 1 || req.ScaleDownCount > req.MaxInstances {
		c.JSON(http.StatusBadRequest, gin.H{"error": "scale_down_count invalid"})
		return
	}

	if req.CooldownSec < 1 || req.CooldownSec > 120 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cooldown_seconds must be between 1 and 120"})
		return
	}

	cooldown := time.Duration(req.CooldownSec) * time.Second

	h.autoState.UpdateConfig(
		req.MinInstances,
		req.MaxInstances,
		req.ScaleUpCount,
		req.ScaleDownCount,
		cooldown,
	)

	logger.AutoscalerEvent(
		fmt.Sprintf(
			"Admin updated autoscaler config | min=%d max=%d up=%d down=%d cooldown=%ds",
			req.MinInstances,
			req.MaxInstances,
			req.ScaleUpCount,
			req.ScaleDownCount,
			req.CooldownSec,
		),
	)

	c.JSON(http.StatusOK, gin.H{"status": "autoscaler config updated"})
}

func (h *AdminHandler) StopInstance(c *gin.Context) {

	id := c.Param("instance_id")

	if id == h.lbInstanceID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot stop load balancer instance"})
		return
	}

	err := h.awsClient.StopInstance(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	h.manager.RemoveVM(id)

	logger.AutoscalerEvent(fmt.Sprintf("Admin stopped instance %s", id))

	c.JSON(http.StatusOK, gin.H{"status": "instance stopped"})
}

func (h *AdminHandler) RestartInstance(c *gin.Context) {

	id := c.Param("instance_id")

	if id == h.lbInstanceID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot restart load balancer instance"})
		return
	}

	err := h.awsClient.RebootInstance(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	h.manager.RemoveVM(id)

	logger.AutoscalerEvent(fmt.Sprintf("Admin restarted instance %s", id))

	c.JSON(http.StatusOK, gin.H{"status": "instance restarting"})
}



func RegisterAdminRoutes(
	r *gin.Engine,
	handler *AdminHandler,
) {

	admin := r.Group("/admin")

	admin.GET("/autoscaler/config", handler.GetAutoscalerConfig)
	admin.PUT("/autoscaler/config", handler.UpdateAutoscalerConfig)

	admin.POST("/instance/stop/:instance_id", handler.StopInstance)
	admin.POST("/instance/restart/:instance_id", handler.RestartInstance)
}