import VMCard from "./VMCard"

export default function VMGrid({ vms }) {
  if (!vms || vms.length === 0) {
    return <p className="text-gray-400">Waiting for VM data…</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {vms.map(vm => (
        <VMCard key={vm.VMID} vm={vm} />
      ))}
    </div>
  )
}

