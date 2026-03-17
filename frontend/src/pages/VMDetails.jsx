import { useParams, useNavigate } from "react-router-dom"
import { useDashboardStore } from "../store/dashboardStore"
import { GlassCard } from "../components/ui/GlassCard"
import {
  ArrowLeft,
  Power,
  RefreshCcw,
  PauseCircle,
  Cpu,
  Database,
  Wifi,
  Activity,
} from "lucide-react"
import { useEffect, useState } from "react"
import VMGraph from "../components/dashboard/VMGraph"

export default function VMDetails() {
  const { vmId } = useParams()
  const navigate = useNavigate()
  const { vms } = useDashboardStore()

  const vm = vms.find(v => v.InstanceID === vmId)

  const [details, setDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `http://3.226.122.247:8080/admin/instance/${vmId}/details`
        )

        const data = await res.json()
        setDetails(data)
      } catch (err) {
        console.error("Failed to fetch instance details", err)
      }

      setLoadingDetails(false)
    }

    fetchDetails()
  }, [vmId])

  const handleStop = async () => {
    try {
      await fetch(
        `http://3.226.122.247:8080/admin/instance/stop/${vmId}`,
        { method: "POST" }
      )
    } catch (err) {
      console.error("Stop failed", err)
    }

    navigate(-1)
  }

  const handleRestart = async () => {
    try {
      await fetch(
        `http://3.226.122.247:8080/admin/instance/restart/${vmId}`,
        { method: "POST" }
      )
    } catch (err) {
      console.error("Restart failed", err)
    }

    navigate(-1)
  }

  if (!vm) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">VM not found</p>
      </div>
    )
  }

  const m = vm.Metrics || {}

  return (
    <div className="space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-accent font-semibold hover:underline"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to VMs
      </button>

      {/* Header */}
      <GlassCard className="p-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Virtual Machine
            </p>
            <h1 className="text-4xl font-display font-bold text-gray-900">
              {vm.VMIP}
            </h1>
            <p className="text-gray-600 font-mono">{vm.InstanceID}</p>
          </div>

          <StatusBadge status={vm.Status} />
        </div>
      </GlassCard>

      {/* Actions */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
          Actions
        </h3>
        <div className="flex gap-3">
          <ActionButton icon={Power} label="Start VM" />
          <ActionButton icon={PauseCircle} label="Stop VM" onClick={handleStop} />
          <ActionButton icon={RefreshCcw} label="Restart" onClick={handleRestart} />
        </div>
      </GlassCard>

      {/* Instance Details */}
      <GlassCard className="p-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase">
          Instance Details
        </h3>

        {loadingDetails ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : details ? (
          <>
            {/* TOP ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <FancyItem label="Type" value={details.instance_type} />
              <FancyItem label="CPU" value={details.cpu} />
              <FancyItem label="Memory" value={details.memory} />
              <FancyItem label="OS" value={details.os} />

            </div>

            {/* STATE + TIME */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <StateBadge state={details.state} />

              <FancyItem
                label="Launch Date"
                value={formatDate(details.launch_time)}
              />

              <FancyItem
                label="Launch Time"
                value={formatTime(details.launch_time)}
              />

            </div>
          </>
        ) : (
          <p className="text-red-400 text-sm">Failed to load details</p>
        )}
      </GlassCard>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Cpu} title="CPU" value={`${m.CPUPercent?.toFixed(1) ?? 0}%`} />
        <MetricCard icon={Database} title="Memory" value={`${m.MemoryPercent?.toFixed(1) ?? 0}%`} />
        <MetricCard icon={Wifi} title="Network" value={`${m.NetworkMbps?.toFixed(2) ?? 0} Mbps`} />
        <MetricCard icon={Activity} title="Load" value={`${m.LoadPercent?.toFixed(1) ?? 0}%`} />
      </div>

<VMGraph
  instanceId={vm.InstanceID}
  vmIP={vm.VMIP}
/>
    </div>
  )
}

/* ---------- COMPONENTS ---------- */

function ActionButton({ icon: Icon, label, onClick }) {
  const styles = {
    "Start VM": "bg-green-50 text-green-600 border-green-200 hover:bg-green-100",
    "Stop VM": "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
    "Restart": "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100",
  }

  const style = styles[label] || "bg-gray-50 text-gray-600 border-gray-200"

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-5 py-2 rounded-xl border 
        font-semibold text-sm transition-all cursor-pointer
        ${style}
      `}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}

function MetricCard({ icon: Icon, title, value }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5" />
        <p className="text-sm font-semibold text-gray-500 uppercase">
          {title}
        </p>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </GlassCard>
  )
}

function FancyItem({ label, value }) {
  return (
    <div className="rounded-xl px-4 py-3 bg-white/60 border border-gray-200">
      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">
        {value || "-"}
      </p>
    </div>
  )
}

function StatusBadge({ status }) {
  const colors = {
    ACTIVE: "bg-green-50 text-green-600 border-green-200",
    SUSPECT: "bg-yellow-50 text-yellow-600 border-yellow-200",
    DISABLED: "bg-red-50 text-red-600 border-red-200",
  }

  const style = colors[status] || "bg-gray-50 text-gray-600 border-gray-200"

  return (
    <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${style}`}>
      {status}
    </span>
  )
}

function StateBadge({ state }) {
  const colors = {
    running: "bg-green-50 text-green-600 border-green-200",
    stopped: "bg-red-50 text-red-600 border-red-200",
    pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
  }

  const style = colors[state] || "bg-gray-50 text-gray-600 border-gray-200"

  return (
    <div className={`rounded-xl px-4 py-3 border ${style}`}>
      <p className="text-xs uppercase text-gray-400 mb-1">State</p>
      <p className="text-sm font-bold capitalize">{state}</p>
    </div>
  )
}

/* ---------- HELPERS ---------- */

function formatDate(ts) {
  if (!ts) return "-"
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatTime(ts) {
  if (!ts) return "-"
  const d = new Date(ts)
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })
}