import { useNavigate } from "react-router-dom"
import { GlassCard } from "../ui/GlassCard"
import { Cpu, Database, Wifi } from "lucide-react"

export default function VMCard({ vm }) {
  const navigate = useNavigate()
  const m = vm.Metrics || {}

  return (
    <GlassCard
      hoverEffect
      onClick={() => navigate(`/vms/${vm.VMID}`)}
      className="cursor-pointer relative overflow-hidden group"
    >
      {/* Status strip */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          vm.Status === "ACTIVE"
            ? "bg-status-running"
            : vm.Status === "SUSPECT"
            ? "bg-status-warning"
            : "bg-status-stopped"
        }`}
      />

      <div className="pl-3 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              VM ID
            </p>
            <h3 className="font-mono font-bold text-gray-900 text-lg">
              {vm.VMID}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{vm.VMIP}</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
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

        {/* Load */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Load</span>
            <span className="font-bold">
              {(m.LoadPercent ?? 0).toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.min(m.LoadPercent ?? 0, 100)}%` }}
            />
          </div>
        </div>

        {/* Bottom metrics */}
        <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
          <Metric icon={Cpu} value={`${(m.CPUPercent ?? 0).toFixed(1)}%`} />
          <Metric icon={Database} value={`${(m.MemoryPercent ?? 0).toFixed(1)}%`} />
          <Metric icon={Wifi} value={`${(m.NetworkMbps ?? 0).toFixed(2)} Mbps`} />
        </div>
      </div>
    </GlassCard>
  )
}

function Metric({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-4 h-4 text-accent" />
      <span className="font-medium">{value}</span>
    </div>
  )
}

