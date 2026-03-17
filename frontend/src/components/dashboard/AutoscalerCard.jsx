import { GlassCard } from "../ui/GlassCard"
import { useDashboardStore } from "../../store/dashboardStore"
import { ArrowUp, ArrowDown, Clock } from "lucide-react"

export default function AutoscalerCard() {
  const { autoscaler } = useDashboardStore()

  if (!autoscaler) {
    return (
      <GlassCard className="p-5">
        <p className="text-sm text-gray-400 italic">
          Autoscaler data not available
        </p>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6 space-y-6">

      {/* Header */}
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        Autoscaler
      </h3>

      {/* BIG RANGE */}
      <div className="flex items-center justify-between">

        <BigStat
          label="Min"
          value={autoscaler.min_instances}
          color="green"
        />

        <span className="text-2xl text-gray-200 font-light">—</span>

        <BigStat
          label="Max"
          value={autoscaler.max_instances}
          color="accent"
        />

      </div>

      {/* SMALL STATS */}
      <div className="grid grid-cols-3 gap-3">

        <MiniStat
          icon={ArrowUp}
          label="Scale Up"
          value={autoscaler.scale_up_count}
          color="blue"
        />

        <MiniStat
          icon={ArrowDown}
          label="Scale Down"
          value={autoscaler.scale_down_count}
          color="red"
        />

        <MiniStat
          icon={Clock}
          label="Cooldown"
          value={`${autoscaler.cooldown_seconds}s`}
          color="purple"
        />

      </div>

    </GlassCard>
  )
}

/* ---------- COMPONENTS ---------- */

function BigStat({ label, value, color }) {
  const colors = {
    green: "text-green-500",
    accent: "text-accent",
  }

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <span className={`text-4xl font-bold ${colors[color]}`}>
        {value}
      </span>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colorMap[color]}`}>
      
      <div className="w-6 h-6 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>

      <div>
        <p className="text-xs opacity-70">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>

    </div>
  )
}