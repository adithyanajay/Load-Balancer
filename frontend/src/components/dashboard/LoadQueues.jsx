import { GlassCard } from "../ui/GlassCard"

export default function LoadQueues({ underload, overload, vms }) {
  // Build lookup map once
  const vmMap = {}
  vms.forEach(vm => {
    vmMap[vm.InstanceID] = vm
  })

  return (
    <div className="space-y-6">
      {/* Underload Queue */}
      <QueueCard
        title="Underload Queue (FIFO)"
        color="green"
        ids={underload}
        vmMap={vmMap}
      />

      {/* Overload Queue */}
      <QueueCard
        title="Overload Queue"
        color="red"
        ids={overload}
        vmMap={vmMap}
      />
    </div>
  )
}

function QueueCard({ title, color, ids, vmMap }) {
  const colorClasses = {
    green: "border-green-200 bg-green-50 text-green-700",
    red: "border-red-200 bg-red-50 text-red-700",
  }

  return (
    <GlassCard className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {title}
      </h3>

      {ids.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          No VMs in this queue
        </p>
      ) : (
        <ul className="space-y-2">
          {ids.map((id, index) => {
            const vm = vmMap[id]
            if (!vm) return null

            return (
              <li
                key={id}
                className={`px-3 py-2 rounded-lg border text-sm font-mono ${colorClasses[color]}`}
              >
                <div className="flex justify-between">
                  <span>{index === 0 ? "▶ " : ""}{vm.VMIP}</span>
                  <span className="text-xs opacity-70">
                    {vm.Status}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </GlassCard>
  )
}
