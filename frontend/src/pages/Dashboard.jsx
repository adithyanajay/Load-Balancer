import { useDashboardStore } from "../store/dashboardStore"
import { GlassCard } from "../components/ui/GlassCard"
import { Server, Activity, AlertTriangle, Clock } from "lucide-react"

export default function Dashboard() {
  const { summary } = useDashboardStore()

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-gray-900">
          Cluster Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Real-time infrastructure monitoring and status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total VMs Card */}
        <GlassCard className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Virtual Machines
              </p>
              <h2 className="text-5xl font-display font-bold text-gray-900">
                {summary.TotalVMs}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Server className="w-7 h-7 text-accent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active</p>
              <p className="text-3xl font-bold text-green-600">
                {summary.ActiveVMs}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Suspect</p>
              <p className="text-3xl font-bold text-yellow-600">
                {summary.SuspectVMs}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Load Distribution Card */}
        <GlassCard className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Load Distribution
              </p>
              <h2 className="text-5xl font-display font-bold text-gray-900">
                Live
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Activity className="w-7 h-7 text-purple-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Underloaded</p>
              <p className="text-3xl font-bold text-purple-600">
                {summary.UnderloadVMs}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Overloaded</p>
              <p className="text-3xl font-bold text-red-600">
                {summary.OverloadVMs}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Disabled VMs
            </h3>
          </div>

          <p className="text-4xl font-bold text-red-600 mb-2">
            {summary.DisabledVMs}
          </p>
          <p className="text-sm text-gray-500">
            Manually stopped or scaled down
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Last Update
            </h3>
          </div>

          <p className="text-2xl font-mono text-gray-800 mb-2">
            {new Date(summary.LastUpdate * 1000).toLocaleTimeString()}
          </p>
          <p className="text-sm text-gray-500">
            Most recent system monitor report
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
