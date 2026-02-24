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

export default function VMDetails() {
  const { vmId } = useParams()
  const navigate = useNavigate()
  const { vms } = useDashboardStore()

  const vm = vms.find(v => v.InstanceID === vmId)

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

          <span className="px-4 py-2 rounded-xl text-sm font-bold border">
            {vm.Status}
          </span>
        </div>
      </GlassCard>

      {/* Actions */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
          Actions
        </h3>
        <div className="flex gap-3">
          <ActionButton icon={Power} label="Start VM" />
          <ActionButton icon={PauseCircle} label="Stop VM" />
          <ActionButton icon={RefreshCcw} label="Restart" />
        </div>
      </GlassCard>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Cpu} title="CPU" value={`${m.CPUPercent?.toFixed(1) ?? 0}%`} />
        <MetricCard icon={Database} title="Memory" value={`${m.MemoryPercent?.toFixed(1) ?? 0}%`} />
        <MetricCard icon={Wifi} title="Network" value={`${m.NetworkMbps?.toFixed(2) ?? 0} Mbps`} />
        <MetricCard icon={Activity} title="Load" value={`${m.LoadPercent?.toFixed(1) ?? 0}%`} />
      </div>
    </div>
  )
}

function ActionButton({ icon: Icon, label }) {
  return (
    <button className="flex items-center gap-2 px-5 py-2 rounded-xl border font-semibold text-sm">
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
