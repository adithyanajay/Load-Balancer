package loadbalancer

import (
	"load-balancer/internal/state"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	selector *Selector
	state    *state.Manager
}

func NewHandler(sel *Selector, sm *state.Manager) *Handler {
	return &Handler{selector: sel, state: sm}
}

// func (h *Handler) HandleRequest(c *gin.Context) {
// 	vmID, err := h.selector.SelectVM()
// 	if err != nil {
// 		c.JSON(http.StatusServiceUnavailable, gin.H{
// 			"error": "no active VM available",
// 		})
// 		return
// 	}

// 	vm := h.state.GetAll()[vmID]
// 	ProxyRequest(c.Writer, c.Request, vm)
// }

func (h *Handler) HandleRequest(c *gin.Context) {
	vmID, err := h.selector.SelectVM()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error": "no active VM available",
		})
		return
	}

	vm := h.state.GetVMByID(vmID)
	if vm == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error": "selected VM not found",
		})
		return
	}

	ProxyRequest(c.Writer, c.Request, vm)
}
