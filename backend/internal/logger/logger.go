package logger

import (
	"log"
	"sync"
	"time"
)

var mu sync.Mutex

func ThresholdState(under []string, over []string) {
	mu.Lock()
	defer mu.Unlock()

	log.Printf(
		"[THRESHOLD] Underload=%v | Overload=%v",
		under,
		over,
	)
}

func Info(msg string) {
	mu.Lock()
	defer mu.Unlock()

	log.Printf("[INFO] %s | %s", time.Now().Format(time.RFC3339), msg)
}

func StateChange(instanceID string, from string, to string) {
	mu.Lock()
	defer mu.Unlock()

	log.Printf(
		"[STATE] %s | Instance=%s | %s -> %s",
		time.Now().Format(time.RFC3339),
		instanceID,
		from,
		to,
	)
}

func MetricsUpdate(instanceID string, load float64) {
	mu.Lock()
	defer mu.Unlock()

	log.Printf(
		"[METRICS] %s | Instance=%s | Load=%.2f%%",
		time.Now().Format(time.RFC3339),
		instanceID,
		load,
	)
}

func AutoscalerTick() {
	mu.Lock()
	defer mu.Unlock()

	log.Printf("[AUTOSCALER] Tick | %s", time.Now().Format(time.RFC3339))
}

func AutoscalerEvent(event string) {
	mu.Lock()
	defer mu.Unlock()

	log.Printf("[AUTOSCALER] %s | %s",
		time.Now().Format(time.RFC3339),
		event,
	)
}

func AutoscalerScaleUp(count int) {
	mu.Lock()
	defer mu.Unlock()

	log.Printf(
		"[AUTOSCALER] %s | SCALE UP | Count=%d",
		time.Now().Format(time.RFC3339),
		count,
	)
}

func AutoscalerScaleDown(instanceID string) {
	mu.Lock()
	defer mu.Unlock()

	log.Printf(
		"[AUTOSCALER] %s | SCALE DOWN | Instance=%s",
		time.Now().Format(time.RFC3339),
		instanceID,
	)
}