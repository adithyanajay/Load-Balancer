package monitor

import (
	"encoding/json"
	"net/http"

	"load-balancer/internal/logger"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) HandleMetrics(c *gin.Context) {
	var req MetricsRequest

	decoder := json.NewDecoder(c.Request.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&req); err != nil {
		logger.Info("JSON decode error: " + err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	if req.InstanceID == "" {
		logger.Info("missing instance_id in payload")
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing instance_id"})
		return
	}

	vmIP := c.ClientIP()
	h.service.ProcessMetrics(req, vmIP)

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
