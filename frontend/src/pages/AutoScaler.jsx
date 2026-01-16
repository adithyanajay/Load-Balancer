import React, { useState } from 'react';
import { autoScalerConfig } from "../data/mockData";
import { GlassCard } from '../components/GlassCard';
import { Sliders, Save, Zap } from 'lucide-react';

export default function AutoScaler() {
  // Using local state to simulate form interaction
  const [config, setConfig] = useState(autoScalerConfig);

  const handleChange = (e) => {
    // Dummy handler
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Auto Scaler</h1>
        <p className="text-gray-500 mt-1">Configure automated resource management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-purple-400 flex items-center justify-center text-white shadow-lg shadow-purple-200">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Automation Settings</h2>
                  <p className="text-sm text-gray-500">Enable and configure auto-scaling rules</p>
                </div>
              </div>

              {/* iOS Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Enabled</span>
                <button
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 ${config.autoScalingEnabled ? 'bg-green-400' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${config.autoScalingEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <input
                  type="number"
                  defaultValue={config.minVMs}
                  className="peer w-full bg-white/50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-gray-900 font-bold outline-none focus:ring-2 focus:ring-accent/50 transition-all hover:bg-white/80"
                />
                <label className="absolute left-4 top-2 text-xs font-medium text-gray-500 transition-all peer-focus:text-accent uppercase tracking-wide">
                  Minimum VMs
                </label>
              </div>

              <div className="relative group">
                <input
                  type="number"
                  defaultValue={config.maxVMs}
                  className="peer w-full bg-white/50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-gray-900 font-bold outline-none focus:ring-2 focus:ring-accent/50 transition-all hover:bg-white/80"
                />
                <label className="absolute left-4 top-2 text-xs font-medium text-gray-500 transition-all peer-focus:text-accent uppercase tracking-wide">
                  Maximum VMs
                </label>
              </div>

              <div className="relative group">
                <input
                  type="number"
                  defaultValue={config.scaleUpCooldownMinutes}
                  className="peer w-full bg-white/50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-gray-900 font-bold outline-none focus:ring-2 focus:ring-accent/50 transition-all hover:bg-white/80"
                />
                <label className="absolute left-4 top-2 text-xs font-medium text-gray-500 transition-all peer-focus:text-accent uppercase tracking-wide">
                  Scale Up Cooldown (m)
                </label>
              </div>

              <div className="relative group">
                <input
                  type="number"
                  defaultValue={config.scaleDownCheckMinutes}
                  className="peer w-full bg-white/50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-gray-900 font-bold outline-none focus:ring-2 focus:ring-accent/50 transition-all hover:bg-white/80"
                />
                <label className="absolute left-4 top-2 text-xs font-medium text-gray-500 transition-all peer-focus:text-accent uppercase tracking-wide">
                  Scale Down Interval (m)
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent to-purple-500 text-white rounded-full font-semibold shadow-lg shadow-purple-300 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95">
                <Save className="w-4 h-4" />
                Save Configuration
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-indigo-500 to-purple-600 !border-none text-white">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Sliders className="w-5 h-5" />
              Optimization Tips
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Setting a lower cooldown period allows for faster reaction to traffic spikes, but may increase cost due to rapid provisioning.
            </p>
          </GlassCard>

          <GlassCard className="bg-white/40">
            <h3 className="font-bold text-gray-900 mb-4">Metric Thresholds</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Scale Up CPU</span>
                  <span className="font-bold text-gray-900">&gt; 80%</span>
                </div>
                <div className="w-full bg-white/50 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-status-warning w-[80%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Scale Down CPU</span>
                  <span className="font-bold text-gray-900">&lt; 30%</span>
                </div>
                <div className="w-full bg-white/50 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-status-running w-[30%]"></div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
