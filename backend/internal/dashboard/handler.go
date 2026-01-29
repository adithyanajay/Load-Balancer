package dashboard

import "github.com/gin-gonic/gin"

type Handler struct {
	service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) GetSummary(c *gin.Context) {
	c.JSON(200, h.service.Summary())
}

func (h *Handler) GetVMs(c *gin.Context) {
	c.JSON(200, h.service.VMList())
}

