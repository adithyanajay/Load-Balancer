# System Monitor

Lightweight monitoring agent for VM load metrics collection.

## Features

- CPU usage monitoring from /proc/stat
- Memory usage monitoring from /proc/meminfo
- Network throughput monitoring from /proc/net/dev
- Aggregated load calculation with configurable weights
- Automatic reporting to Load Balancer every 5 seconds
- Retry mechanism for failed requests

## Installation

1. Build the binary:
```bash
make build
```

2. Configure the system:
```bash
cp config.yaml.example config.yaml
# Edit config.yaml with your Load Balancer URL and VM ID
```

3. Run:
```bash
make run
```

## Configuration

Edit `config.yaml`:
```yaml
vm:
  id: "vm-001"
  
loadbalancer:
  url: "http://10.0.1.100:8080"
```

## Systemd Service

To run as a system service:
```bash
make install
```

This will:
- Copy binary to /usr/local/bin
- Install systemd service
- Enable auto-start on boot
