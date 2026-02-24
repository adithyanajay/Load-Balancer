// import { GlassCard } from "../ui/GlassCard"
// import StatusPill from "../ui/StatusPill"
// import { useNavigate } from "react-router-dom"

// export default function VMCard({ vm }) {
//   const navigate = useNavigate()
//   console.log("monkey")
//   // console.log(vm)
//   // console.log(vm.InstanceID)

//   return (
//     <GlassCard
//   //     hoverEffect
//   //     className="cursor-pointer"
//   //     onClick={() => navigate(`/vms/${vm.InstanceID}`)}
//   //   >
//   //     <div className="flex justify-between mb-3">
//   //       <div>
//   //         <p className="text-xs text-gray-400">{vm}</p>
//   //         {/* <p className="font-mono font-bold">{vm.VMIP}</p> */}
//   //         <p className="text-xs text-gray-500">{vm.InstanceID}</p>
//   //       </div>

//   //       <StatusPill status={vm.Status} />
//   //     </div>

//   //     <div className="space-y-2">
//   //       <Metric label="Load" value={vm.Metrics?.LoadPercent ?? 0} />
//   //       <Metric label="CPU" value={vm.Metrics?.CPUPercent ?? 0} />
//   //       <Metric label="Memory" value={vm.Metrics?.MemoryPercent ?? 0} />
//   //     </div>
//   //   </GlassCard>
//   // )
// }

// function Metric({ label, value }) {
//   return (
//     <div>
//       <div className="flex justify-between text-xs">
//         <span>{label}</span>
//         <span>{value.toFixed(1)}%</span>
//       </div>
//       <div className="h-1 bg-gray-200 rounded">
//         <div
//           className="h-full bg-primary rounded"
//           style={{ width: `${Math.min(value, 100)}%` }}
//         />
//       </div>
//     </div>
//   )
// }
