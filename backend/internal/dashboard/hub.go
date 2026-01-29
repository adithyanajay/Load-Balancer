package dashboard

import (
	"encoding/json"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type Hub struct {
	mu       sync.Mutex
	clients  map[*websocket.Conn]bool
	service  *Service
	upgrader websocket.Upgrader
}

func NewHub(s *Service) *Hub {
	return &Hub{
		service: s,
		clients: make(map[*websocket.Conn]bool),
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		},
	}
}

func (h *Hub) HandleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := h.upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	h.mu.Lock()
	h.clients[conn] = true
	h.mu.Unlock()

	h.sendSnapshot(conn)
}

func (h *Hub) PushUpdate() {
	h.mu.Lock()
	defer h.mu.Unlock()

	payload := map[string]interface{}{
		"summary": h.service.Summary(),
		"vms":     h.service.VMList(),
	}

	data, _ := json.Marshal(payload)

	for c := range h.clients {
		_ = c.WriteMessage(websocket.TextMessage, data)
	}
}

func (h *Hub) sendSnapshot(c *websocket.Conn) {
	payload := map[string]interface{}{
		"summary": h.service.Summary(),
		"vms":     h.service.VMList(),
	}
	data, _ := json.Marshal(payload)
	_ = c.WriteMessage(websocket.TextMessage, data)
}

