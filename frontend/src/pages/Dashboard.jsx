import { useDashboardStore } from "../store/dashboardStore"
import { GlassCard } from "../components/ui/GlassCard"
import { Server, Activity, AlertTriangle, Layers } from "lucide-react"

export default function Dashboard() {
  const { summary } = useDashboardStore()

  if (!summary) {
    return (
      <div className="text-gray-400 text-sm">
        Waiting for dashboard data…
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Cluster Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Live infrastructure state from system monitor
        </p>
      </div>

      {/* Top Row – Big Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Total / Active */}
        <GlassCard className="p-8 bg-gradient-to-br from-primary/20 to-accent/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/30 flex items-center justify-center">
              <Server className="w-7 h-7 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Virtual Machines
              </p>
              <h2 className="text-3xl font-display font-bold text-gray-900">
                {summary.TotalVMs}
              </h2>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-700">
                {summary.ActiveVMs}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Suspect</p>
              <p className="text-2xl font-bold text-yellow-600">
                {summary.SuspectVMs}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Load Distribution */}
        <GlassCard className="p-8 bg-gradient-to-br from-purple-100/50 to-white/40">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-200 flex items-center justify-center">
              <Activity className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Load Distribution
              </p>
              <h2 className="text-3xl font-display font-bold text-gray-900">
                Live
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Underloaded</p>
              <p className="text-2xl font-bold text-purple-700">
                {summary.UnderloadVMs}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Overloaded</p>
              <p className="text-2xl font-bold text-red-600">
                {summary.OverloadVMs}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Row – Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="p-6 bg-white/50">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Disabled VMs
            </h3>
          </div>

          <p className="text-3xl font-bold text-red-600">
            {summary.DisabledVMs}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Manually stopped or autoscaled down
          </p>
        </GlassCard>

        <GlassCard className="p-6 bg-white/50">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Last Update
            </h3>
          </div>

          <p className="text-xl font-mono text-gray-800">
            {new Date(summary.LastUpdate * 1000).toLocaleTimeString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Most recent system monitor report
          </p>
        </GlassCard>
      </div>
    </div>
  )
}

