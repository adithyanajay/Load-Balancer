import { useParams, useNavigate } from "react-router-dom"
import { useDashboardStore } from "../store/dashboardStore"
import {
  ArrowLeft,
  Power,
  RefreshCcw,
  PauseCircle,
  Cpu,
  Database,
  Wifi,
} from "lucide-react"

export default function VMDetails() {
  const { vmId } = useParams()
  const navigate = useNavigate()
  const { vms } = useDashboardStore()

  const vm = vms.find(v => v.VMID === vmId)
  if (!vm) return null

  const m = vm.Metrics || {}

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-bg-gradient-start to-bg-gradient-end overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-10 space-y-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="
            flex items-center gap-3
            text-accent font-semibold text-lg
            hover:underline
          "
        >
          <ArrowLeft className="w-6 h-6" />
          Back to VMs
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900">
              {vm.VMID}
            </h1>
            <p className="text-gray-500 mt-1">{vm.VMIP}</p>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              vm.Status === "ACTIVE"
                ? "bg-status-running/20 text-green-700"
                : vm.Status === "SUSPECT"
                ? "bg-status-warning/20 text-yellow-700"
                : "bg-status-stopped/20 text-red-700"
            }`}
          >
            {vm.Status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <ActionButton
            icon={Power}
            label="Start"
            className="bg-green-100 text-green-800 border-green-200"
          />
          <ActionButton
            icon={PauseCircle}
            label="Stop"
            className="bg-red-100 text-red-800 border-red-200"
          />
          <ActionButton
            icon={RefreshCcw}
            label="Restart"
            className="bg-purple-100 text-purple-800 border-purple-200"
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Metric title="CPU Usage" value={`${(m.CPUPercent ?? 0).toFixed(1)}%`} icon={Cpu} />
          <Metric title="Memory Usage" value={`${(m.MemoryPercent ?? 0).toFixed(1)}%`} icon={Database} />
          <Metric title="Network" value={`${(m.NetworkMbps ?? 0).toFixed(2)} Mbps`} icon={Wifi} />
          <Metric title="Load" value={`${(m.LoadPercent ?? 0).toFixed(1)}%`} />
        </div>

        {/* Graph placeholder */}
        <div className="border border-gray-200 rounded-2xl p-6 bg-white">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Load Trend
          </h2>

          <div className="h-48 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
            Graph placeholder
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Components ---------- */

function ActionButton({ icon: Icon, label, className }) {
  return (
    <button
      className={`
        flex items-center gap-2
        px-6 py-3 rounded-xl
        border font-semibold
        hover:bg-opacity-80
        transition
        ${className}
      `}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  )
}

function Metric({ title, value, icon: Icon }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {value}
        </p>
      </div>
      {Icon && (
        <Icon className="w-6 h-6 text-accent" />
      )}
    </div>
  )
}

