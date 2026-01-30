import { useEffect, useState } from "react"

let socket = null
const listeners = new Set()

const state = {
  summary: null,
  vms: []
}

// Track load status with hysteresis for each VM
const loadStatusTracker = {}

function calculateLoadStatus(vmId, loadPercent) {
  // Initialize if first time seeing this VM
  if (!loadStatusTracker[vmId]) {
    loadStatusTracker[vmId] = loadPercent >= 75 ? 'OVERLOAD' : 'UNDERLOAD'
    return loadStatusTracker[vmId]
  }

  const currentStatus = loadStatusTracker[vmId]

  // Hysteresis logic
  if (currentStatus === 'UNDERLOAD') {
    // Switch to OVERLOAD only when hitting 75% or above
    if (loadPercent >= 75) {
      loadStatusTracker[vmId] = 'OVERLOAD'
    }
  } else if (currentStatus === 'OVERLOAD') {
    // Switch back to UNDERLOAD only when dropping to 25% or below
    if (loadPercent <= 25) {
      loadStatusTracker[vmId] = 'UNDERLOAD'
    }
  }

  return loadStatusTracker[vmId]
}

function notify() {
  listeners.forEach(l => l({ ...state }))
}

export function useDashboardStore() {
  const [data, setData] = useState({ ...state })

  useEffect(() => {
    listeners.add(setData)

    // Push current state immediately
    setData({ ...state })

    return () => listeners.delete(setData)
  }, [])

  return data
}

export function connectDashboardWS(url) {
  if (socket) return

  socket = new WebSocket(url)

  socket.onmessage = (e) => {
    const payload = JSON.parse(e.data)

    state.summary = payload.summary || null
    
    // Process VMs and add load status
    const vmsArray = Array.isArray(payload.vms)
      ? payload.vms
      : Object.values(payload.vms || {})

    state.vms = vmsArray.map(vm => {
      const loadPercent = vm.Metrics?.LoadPercent ?? 0
      const loadStatus = calculateLoadStatus(vm.VMID, loadPercent)
      
      return {
        ...vm,
        LoadStatus: loadStatus
      }
    })

    notify()
  }

  socket.onclose = () => {
    socket = null
    setTimeout(() => connectDashboardWS(url), 3000)
  }

  socket.onerror = () => {
    socket.close()
  }
}
