import StatCard from "../components/layout/StatCard"
import { Server, AlertTriangle, Layers } from "lucide-react"
import { useDashboardStore } from "../store/dashboardStore.js"

export default function Dashboard() {
  const { summary } = useDashboardStore()

  if (!summary) return null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">System Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total VMs"
          value={summary.total_vms}
          icon={Server}
        />

        <StatCard
          title="Underload VMs"
          value={summary.underload_vms}
          icon={Layers}
        />

        <StatCard
          title="Overload VMs"
          value={summary.overload_vms}
          icon={AlertTriangle}
        />
      </div>
    </div>
  )
}

