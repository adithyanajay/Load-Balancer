.PHONY: build run clean install

BINARY_NAME=system-monitor
BUILD_DIR=bin

build:
	go build -o $(BUILD_DIR)/$(BINARY_NAME) cmd/monitor/main.go

run: build
	./$(BUILD_DIR)/$(BINARY_NAME)

clean:
	rm -rf $(BUILD_DIR)
	go clean

install: build
	sudo cp $(BUILD_DIR)/$(BINARY_NAME) /usr/local/bin/
	sudo cp system-monitor.service /etc/systemd/system/
	sudo systemctl daemon-reload
	sudo systemctl enable system-monitor
	sudo systemctl start system-monitor

deps:
	go mod download
	go mod tidy

test:
	go test -v ./...
