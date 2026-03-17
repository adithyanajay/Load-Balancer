import { useState } from "react"
import { useDashboardStore } from "../../store/dashboardStore"
import { GlassCard } from "../ui/GlassCard"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

export default function VMGraph({ instanceId, vmIP }) {
  const { vmHistory } = useDashboardStore()
  const [mode, setMode] = useState("memory") // default

  const data = (vmHistory[instanceId] || []).map((p) => ({
    time: formatTime(p.timestamp),
    cpu: p.cpu,
    memory: p.memory,
  }))

  return (
    <GlassCard className="p-6 space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <p className="text-xs text-gray-400 uppercase">VM</p>
          <p className="text-lg font-bold text-gray-900">{vmIP}</p>
          <p className="text-xs text-gray-500 font-mono">{instanceId}</p>
        </div>

        {/* TOGGLE */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <ToggleButton
            active={mode === "memory"}
            onClick={() => setMode("memory")}
            label="Memory"
          />
          <ToggleButton
            active={mode === "cpu"}
            onClick={() => setMode("cpu")}
            label="CPU"
          />
        </div>
      </div>

      {/* GRAPH */}
      <div className="h-64">

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>

       <CartesianGrid 
  strokeDasharray="4 4"
  stroke="#e5e7eb"
  vertical={false}
/>

            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              stroke="#9ca3af"
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              stroke="#9ca3af"
            />

            <Tooltip />

            {mode === "memory" ? (
              <Line
                type="monotone"
                dataKey="memory"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
            ) : (
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            )}

          </LineChart>
        </ResponsiveContainer>

      </div>

    </GlassCard>
  )
}

/* ---------- COMPONENTS ---------- */

function ToggleButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 text-sm rounded-md font-semibold transition-all
        ${active
          ? "bg-white shadow text-gray-900"
          : "text-gray-500 hover:text-gray-700"}
      `}
    >
      {label}
    </button>
  )
}

/* ---------- HELPERS ---------- */

function formatTime(ts) {
  if (!ts) return ""
  const d = new Date(ts)
  return d.toLocaleTimeString([], {
    minute: "2-digit",
    second: "2-digit",
  })
}