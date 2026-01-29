import { GlassCard } from "../ui/GlassCard"
import StatusPill from "../ui/StatusPill"

export default function VMCard({ vm, onClick }) {
  return (
    <GlassCard hoverEffect onClick={onClick} className="cursor-pointer">
      <div className="flex justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400">VM ID</p>
          <p className="font-mono font-bold">{vm.vm_id}</p>
          <p className="text-xs text-gray-500">{vm.vm_ip}</p>
        </div>
        <StatusPill status={vm.status} />
      </div>

      <div className="space-y-2">
        <Metric label="Load" value={vm.load_percent} />
        <Metric label="CPU" value={vm.cpu_percent} />
        <Metric label="Memory" value={vm.memory_percent} />
      </div>
    </GlassCard>
  )
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{value.toFixed(1)}%</span>
      </div>
      <div className="h-1 bg-gray-200 rounded">
        <div
          className="h-full bg-primary rounded"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  )
}

