import { useDashboardStore } from "../store/dashboardStore"
import VMCard from "../components/vm/VMCard"

export default function VMs() {
  const { vms } = useDashboardStore()

  if (!vms.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading VM data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900">
            Virtual Machines
          </h1>
          <p className="text-gray-500 mt-2">
            Manage and monitor all VM instances
          </p>
        </div>
        <div className="px-4 py-2 bg-white/50 rounded-xl text-sm font-semibold text-gray-700">
          {vms.length} Total
        </div>
      </div>

      {/* VM Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vms.map(vm => (
          <VMCard key={vm.VMID} vm={vm} />
        ))}
      </div>
    </div>
  )
}
