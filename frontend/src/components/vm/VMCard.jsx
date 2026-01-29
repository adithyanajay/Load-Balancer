import { useNavigate } from "react-router-dom"
import { GlassCard } from "../ui/GlassCard"

export default function VMCard({ vm }) {
  const nav = useNavigate()

  return (
    <GlassCard
      hoverEffect
      className="cursor-pointer"
      onClick={() => nav(`/vms/${vm.VMID}`)}
    >
      <h3 className="font-mono font-bold">{vm.VMID}</h3>
      <p className="text-sm text-gray-500">{vm.VMIP}</p>
      <p className="mt-2">Load: {vm.Metrics?.LoadPercent ?? 0}%</p>
      <p>Status: {vm.Status}</p>
    </GlassCard>
  )
}

