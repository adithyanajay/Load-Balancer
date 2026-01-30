import { useNavigate } from "react-router-dom"
import { GlassCard } from "../ui/GlassCard"
import VMStatusPill from "./VMStatusPill"
import { Cpu, Database, Activity } from "lucide-react"

export default function VMCard({ vm }) {
  const navigate = useNavigate()
  const m = vm.Metrics || {}

  // Use LoadStatus instead of Status for coloring
  const loadStatus = vm.LoadStatus || 'UNDERLOAD'

  return (
    <GlassCard 
      hoverEffect 
      onClick={() => navigate(`/vms/${vm.VMID}`)}
      className="relative overflow-hidden"
    >
      {/* Status indicator bar based on load */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          loadStatus === "UNDERLOAD" 
            ? "bg-status-running" 
            : "bg-status-stopped"
        }`} 
      />

      {/* Header */}
      <div className="flex justify-between items-start mb-4 pl-2">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            VM ID
          </p>
          <h3 className="text-lg font-bold text-gray-900 font-mono mt-1">
            {vm.VMID}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{vm.VMIP}</p>
        </div>
        <VMStatusPill status={loadStatus} />
      </div>

      {/* Metrics */}
      <div className="space-y-3 pl-2">
        <MetricRow 
          icon={Cpu} 
          label="CPU" 
          value={`${(m.CPUPercent ?? 0).toFixed(1)}%`}
          percent={m.CPUPercent ?? 0}
        />
        
        <MetricRow 
          icon={Database} 
          label="Memory" 
          value={`${(m.MemoryPercent ?? 0).toFixed(1)}%`}
          percent={m.MemoryPercent ?? 0}
        />
        
        <MetricRow 
          icon={Activity} 
          label="Load" 
          value={`${(m.LoadPercent ?? 0).toFixed(1)}%`}
          percent={m.LoadPercent ?? 0}
        />
      </div>
    </GlassCard>
  )
}

function MetricRow({ icon: Icon, label, value, percent }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-gray-600">
          <Icon className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percent > 80 ? 'bg-status-warning' : 'bg-accent'
          }`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}
