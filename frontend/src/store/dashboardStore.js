import { useEffect, useState } from "react"

let socket = null
const listeners = new Set()

const state = {
  summary: null,
  vms: []
}

function notify() {
  listeners.forEach(l => l({ ...state }))
}


export function useDashboardStore() {
  const [data, setData] = useState({ ...state })

  useEffect(() => {
    listeners.add(setData)

    // 🔴 IMPORTANT: push current state immediately
    setData({ ...state })

    return () => listeners.delete(setData)
  }, [])

  console.log(data)

  return data
}



export function connectDashboardWS(url) {
  if (socket) return

  socket = new WebSocket(url)

  socket.onmessage = (e) => {
    const payload = JSON.parse(e.data)

    state.summary = payload.summary || null
    state.vms = Array.isArray(payload.vms)
      ? payload.vms
      : Object.values(payload.vms || {})

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

