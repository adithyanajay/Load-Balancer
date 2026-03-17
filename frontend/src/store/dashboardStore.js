import { useEffect, useState } from "react"
import { data } from "react-router-dom"

let socket = null
const listeners = new Set()

const state = {
  summary: null,
  vms: [],
  queues: {
    underload: [],
    overload: [],
  },
  autoscaler: null,

  vmHistory: {}, // ✅ NEW
}
const loadStatusTracker = {}

function calculateLoadStatus(instanceId, loadPercent) {
  if (!loadStatusTracker[instanceId]) {
    loadStatusTracker[instanceId] =
      loadPercent >= 75 ? "OVERLOAD" : "UNDERLOAD"
    return loadStatusTracker[instanceId]
  }

  const currentStatus = loadStatusTracker[instanceId]

  if (currentStatus === "UNDERLOAD" && loadPercent >= 75) {
    loadStatusTracker[instanceId] = "OVERLOAD"
  } else if (currentStatus === "OVERLOAD" && loadPercent <= 25) {
    loadStatusTracker[instanceId] = "UNDERLOAD"
  }

  return loadStatusTracker[instanceId]
}

function notify() {
  listeners.forEach((l) => l({ ...state }))
}

export function useDashboardStore() {
  const [data, setData] = useState({ ...state })

  useEffect(() => {
    listeners.add(setData)
    setData({ ...state })
    return () => listeners.delete(setData)
  }, [])

  return data
}

function updateVMHistory(vmsArray) {
  const newHistory = {}

  vmsArray.forEach(vm => {
    const id = vm.InstanceID
    const metrics = vm.Metrics || {}

    const timestamp = metrics.Timestamp
    if (!timestamp) return

    const point = {
      timestamp,
      cpu: metrics.CPUPercent ?? 0,
      memory: metrics.MemoryPercent ?? 0,
    }

    const existing = state.vmHistory[id] || []

    const updated = [...existing, point]

    // ✅ FIFO: remove oldest if > 40
    if (updated.length > 20) {
      updated.shift()
    }

    newHistory[id] = updated
  })

  // Remove missing VMs automatically
  state.vmHistory = newHistory
}



export function connectDashboardWS(url) {
  if (socket) return

  socket = new WebSocket(url)

  socket.onmessage = (e) => {
    const payload = JSON.parse(e.data)


    // Summary
    state.summary = payload.summary ?? null

 

    // VMs
    const vmsArray = Array.isArray(payload.vms)
      ? payload.vms
      : Object.values(payload.vms ?? {})

    state.vms = vmsArray.map((vm) => {
     
      const loadPercent = vm.Metrics?.LoadPercent ?? 0
      return {
        ...vm,
        LoadStatus: calculateLoadStatus(vm.InstanceID, loadPercent),
      }
    })

    // ✅ FIX: queues come from payload.queues
    state.queues = {
      underload: payload.queues?.underload ?? [],
      overload: payload.queues?.overload ?? [],
    }

    state.autoscaler = payload.autoscaler ?? null
updateVMHistory(vmsArray)

console.log(state.vmHistory)
    notify()
  }

  socket.onclose = () => {
    socket = null
    setTimeout(() => connectDashboardWS(url), 3000)
  }

  socket.onerror = () => socket.close()
}
