import { useDashboardStore } from "../store/dashboardStore"
import VMGrid from "../components/vm/VMGrid"

export default function VMs() {
  const { vms } = useDashboardStore()

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">VMs</h1>
      <VMGrid vms={vms} />
    </>
  )
}

