import { useEffect, useState } from "react"

let socket = null
let listeners = []

const state = {
  summary: null,
  vms: []
}

function notify() {
  listeners.forEach(l => l({ ...state }))
}

export function useDashboardStore() {
  const [data, setData] = useState(state)

  useEffect(() => {
    listeners.push(setData)
    return () => {
      listeners = listeners.filter(l => l !== setData)
    }
  }, [])

  return data
}

export function connectDashboardWS(url) {
  if (socket) return

  socket = new WebSocket(url)

  socket.onmessage = e => {
    const payload = JSON.parse(e.data)

    state.summary = payload.summary
    state.vms = Object.values(payload.vms || {}) // 🔴 FIX
    notify()
  }
}

