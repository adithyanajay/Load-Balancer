package loadbalancer

import (
	"net/http"
	"load-balancer/internal/state"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	selector *Selector
	state    *state.Manager
}

func NewHandler(sel *Selector, sm *state.Manager) *Handler {
	return &Handler{selector: sel, state: sm}
}

func (h *Handler) HandleRequest(c *gin.Context) {
	vmID, err := h.selector.SelectVM()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error": "no active VM available",
		})
		return
	}

	vm := h.state.GetAll()[vmID]
	ProxyRequest(c.Writer, c.Request, vm)
}

