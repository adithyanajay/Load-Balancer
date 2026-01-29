import { useParams, useNavigate } from "react-router-dom"
import { useDashboardStore } from "../store/dashboardStore"
import { GlassCard } from "../components/ui/GlassCard"
import { ArrowLeft } from "lucide-react"

export default function VMDetails() {
  const { vmId } = useParams()
  const navigate = useNavigate()
  const { vms } = useDashboardStore()

  const vm = vms.find(v => v.vm_id === vmId)
  if (!vm) return null

  return (
    <div className="fixed inset-0 z-50 bg-bg-gradient-start/80 backdrop-blur-lg overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to VMs
        </button>

        <GlassCard className="space-y-6">
          <h1 className="text-3xl font-display font-bold">{vm.vm_id}</h1>

          <Info label="IP Address" value={vm.vm_ip} />
          <Info label="Status" value={vm.status} />
          <Info label="CPU Usage" value={`${vm.cpu_percent}%`} />
          <Info label="Memory Usage" value={`${vm.memory_percent}%`} />
          <Info label="Network Usage" value={`${vm.network_percent}%`} />

          {/* AWS buttons placeholder */}
          <div className="flex gap-3 pt-4">
            <Action disabled label="Start VM" />
            <Action disabled label="Stop VM" />
            <Action disabled label="Restart VM" />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}

function Action({ label, disabled }) {
  return (
    <button
      disabled={disabled}
      className="px-4 py-2 rounded-xl bg-gray-200 text-gray-400 cursor-not-allowed"
    >
      {label}
    </button>
  )
}

