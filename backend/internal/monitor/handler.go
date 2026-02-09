package monitor

import (
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
	raw, _ := c.GetRawData()
	logger.Info("RAW PAYLOAD: " + string(raw))
	var req MetricsRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid payload"})
		return
	}

	// source IP = VM private IP
	vmIP := c.ClientIP()

	h.service.ProcessMetrics(req, vmIP)

	c.JSON(200, gin.H{"status": "ok"})
}
