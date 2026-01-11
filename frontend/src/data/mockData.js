// Dashboard overview data
export const dashboardOverview = {
  activeVMs: 8,
  underloadedVMs: 3,
  overloadedVMs: 2,
  queuedRequests: 14,
};

// Active VMs data
export const activeVMsData = [
  {
    vmId: "vm-01",
    state: "RUNNING",
    loadPercent: 40,
    taskCount: 3,
  },
  {
    vmId: "vm-02",
    state: "RUNNING",
    loadPercent: 85,
    taskCount: 7,
  },
  {
    vmId: "vm-03",
    state: "STOPPED",
    loadPercent: 0,
    taskCount: 0,
  },
];

// System Monitor data
export const systemMonitorData = [
  {
    vmId: "vm-01",
    cpuUsage: 35,
    memoryUsage: 60,
    networkUsage: 12.5,
  },
  {
    vmId: "vm-02",
    cpuUsage: 80,
    memoryUsage: 75,
    networkUsage: 30.1,
  },
];

// Auto Scaler configuration
export const autoScalerConfig = {
  minVMs: 2,
  maxVMs: 10,
  autoScalingEnabled: true,
  scaleUpCooldownMinutes: 5,
  scaleDownCheckMinutes: 2,
};
