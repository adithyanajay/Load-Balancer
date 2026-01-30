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

  const vm = vms.find(v => v.VMID === vmId)
  
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
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-accent font-semibold hover:underline transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to VMs
      </button>

      {/* Header */}
      <GlassCard className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Virtual Machine
            </p>
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
              {vm.VMID}
            </h1>
            <p className="text-gray-600">{vm.VMIP}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-xl text-sm font-bold border ${
                vm.Status === "ACTIVE"
                  ? "bg-status-running/20 text-green-700 border-green-200"
                  : vm.Status === "SUSPECT"
                  ? "bg-status-warning/20 text-yellow-700 border-yellow-200"
                  : "bg-status-stopped/20 text-red-700 border-red-200"
              }`}
            >
              {vm.Status}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Actions */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <ActionButton
            icon={Power}
            label="Start VM"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          />
          <ActionButton
            icon={PauseCircle}
            label="Stop VM"
            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          />
          <ActionButton
            icon={RefreshCcw}
            label="Restart"
            className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
          />
        </div>
      </GlassCard>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon={Cpu} 
          title="CPU Usage" 
          value={`${(m.CPUPercent ?? 0).toFixed(1)}%`}
          color="accent"
        />
        <MetricCard 
          icon={Database} 
          title="Memory" 
          value={`${(m.MemoryPercent ?? 0).toFixed(1)}%`}
          color="purple"
        />
        <MetricCard 
          icon={Wifi} 
          title="Network" 
          value={`${(m.NetworkMbps ?? 0).toFixed(2)} Mbps`}
          color="blue"
        />
        <MetricCard 
          icon={Activity} 
          title="Load" 
          value={`${(m.LoadPercent ?? 0).toFixed(1)}%`}
          color="green"
        />
      </div>

      {/* Additional Info */}
      <GlassCard className="p-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
          Performance Trend
        </h3>
        <div className="h-48 rounded-xl bg-gradient-to-br from-accent/5 to-purple-50 flex items-center justify-center text-gray-400">
          Chart placeholder - Implement with your preferred charting library
        </div>
      </GlassCard>
    </div>
  )
}

/* ---------- Components ---------- */

function ActionButton({ icon: Icon, label, className }) {
  return (
    <button
      className={`
        flex items-center gap-2
        px-5 py-2.5 rounded-xl
        border font-semibold text-sm
        transition-all
        ${className}
      `}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}

function MetricCard({ icon: Icon, title, value, color }) {
  const colorClasses = {
    accent: 'bg-accent/10 text-accent',
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </p>
      </div>
      <p className="text-3xl font-bold text-gray-900">
        {value}
      </p>
    </GlassCard>
  )
}
