package monitor

import "github.com/gin-gonic/gin"

type Handler struct {
	service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) HandleMetrics(c *gin.Context) {
	var req MetricsRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid payload"})
		return
	}

	h.service.ProcessMetrics(req)

	c.JSON(200, gin.H{"status": "ok"})
}

