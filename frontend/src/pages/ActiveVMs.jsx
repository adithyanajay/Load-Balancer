import { activeVMsData } from "../data/mockData";
import { GlassCard } from "../components/GlassCard";
import { Cpu, Activity, Clock } from "lucide-react";

export default function ActiveVMs() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Active VMs</h1>
          <p className="text-gray-500 mt-1">Manage virtual machine instances</p>
        </div>
        <div className="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-sm font-medium text-gray-600 shadow-sm border border-white/60">
          Total: {activeVMsData.length} instances
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeVMsData.map((vm) => (
          <GlassCard key={vm.vmId} hoverEffect className="relative overflow-hidden group">
            {/* Status Status Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${vm.state === "RUNNING" ? "bg-status-running" : "bg-status-stopped"
              }`} />

            <div className="flex justify-between items-start mb-4 pl-2">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">VM ID</span>
                <h3 className="text-lg font-bold text-gray-900 font-mono">{vm.vmId}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border border-white/50 ${vm.state === "RUNNING"
                  ? "bg-status-running/20 text-green-700"
                  : "bg-status-stopped/20 text-red-700"
                  }`}
              >
                {vm.state}
              </span>
            </div>

            <div className="space-y-3 pl-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/40 border border-white/50">
                <div className="flex items-center gap-2 text-gray-600">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Load</span>
                </div>
                <span className={`text-sm font-bold ${vm.loadPercent > 80 ? 'text-status-warning' : 'text-gray-900'
                  }`}>
                  {vm.loadPercent}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${vm.loadPercent > 80 ? 'bg-status-warning' : 'bg-primary'
                    }`}
                  style={{ width: `${vm.loadPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/40 border border-white/50">
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Tasks</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{vm.taskCount}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 pl-2">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">Uptime: 24h 12m</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
