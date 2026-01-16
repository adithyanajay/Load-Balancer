import React from 'react';
import { systemMonitorData } from "../data/mockData";
import { GlassCard } from '../components/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Wifi, Database } from 'lucide-react';

// Helper to generate dummy historical data based on a base value
const generateHistory = (baseValue) => {
  return Array.from({ length: 15 }, (_, i) => ({
    time: i,
    value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * 20))
  }));
};

export default function SystemMonitor() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">System Monitor</h1>
        <p className="text-gray-500 mt-1">Real-time performance analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {systemMonitorData.map((vm) => {
          const data = generateHistory(vm.cpuUsage);

          return (
            <GlassCard key={vm.vmId} className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{vm.vmId}</h2>
                    <span className="text-xs text-gray-400">8 vCPUs / 16GB RAM</span>
                  </div>
                </div>
                <div className={`text-2xl font-bold font-mono ${vm.cpuUsage > 80 ? 'text-status-warning' : 'text-gray-700'}`}>
                  {vm.cpuUsage}%
                </div>
              </div>

              {/* CPU Chart */}
              <div className="h-48 w-full -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id={`colorCpu-${vm.vmId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#A78BFA"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill={`url(#colorCpu-${vm.vmId})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Memory Usage */}
                <div className="p-4 rounded-xl bg-white/40 border border-white/60">
                  <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <Database className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Memory</span>
                  </div>
                  <div className="flex items-end justify-between mb-1">
                    <span className="text-xl font-bold text-gray-800">{vm.memoryUsage}%</span>
                    <span className="text-xs text-gray-400">Used</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-green-400 h-full rounded-full"
                      style={{ width: `${vm.memoryUsage}%` }}
                    />
                  </div>
                </div>

                {/* Network Usage */}
                <div className="p-4 rounded-xl bg-white/40 border border-white/60">
                  <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Network</span>
                  </div>
                  <div className="flex items-end justify-between mb-1">
                    <span className="text-xl font-bold text-gray-800">{vm.networkUsage}</span>
                    <span className="text-xs text-gray-400">Mbps</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-400 h-full rounded-full"
                      style={{ width: `${Math.min(vm.networkUsage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
