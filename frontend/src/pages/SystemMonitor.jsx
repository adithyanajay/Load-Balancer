import { useDashboardStore } from "../store/dashboardStore"
import VMGraph from "../components/dashboard/VMGraph"

export default function SystemMonitor() {
  const { vms } = useDashboardStore()

  // ✅ Only ACTIVE VMs
  const activeVMs = vms.filter(vm => vm.Status === "ACTIVE")

  if (!vms.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading system monitor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900">
            System Monitor
          </h1>
          <p className="text-gray-500 mt-2">
            Real-time CPU & Memory usage of running instances
          </p>
        </div>

        <div className="px-4 py-2 bg-white/50 rounded-xl text-sm font-semibold text-gray-700">
          {activeVMs.length} Active
        </div>
      </div>

      {/* GRAPH GRID */}
      {activeVMs.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">No active VMs</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {activeVMs.map(vm => (
            <VMGraph
              key={vm.InstanceID}
              instanceId={vm.InstanceID}
              vmIP={vm.VMIP}
            />
          ))}

        </div>
      )}

    </div>
  )
}