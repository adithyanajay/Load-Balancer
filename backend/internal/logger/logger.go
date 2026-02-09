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
