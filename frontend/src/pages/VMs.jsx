import { useDashboardStore } from "../store/dashboardStore"
import VMCard from "../components/vm/VMCard"

export default function VMs() {
  const { vms } = useDashboardStore()

  if (!vms.length) {
    return <p className="text-gray-400">Waiting for VM data…</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-gray-900">
        Virtual Machines
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vms.map(vm => (
          <VMCard key={vm.VMID} vm={vm} />
        ))}
      </div>
    </div>
  )
}

