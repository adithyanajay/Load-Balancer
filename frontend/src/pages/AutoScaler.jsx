import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Sliders, Save, Zap, TrendingUp, TrendingDown } from 'lucide-react';

export default function AutoScaler() {
  const [config, setConfig] = useState({
    autoScalingEnabled: true,
    minVMs: 2,
    maxVMs: 10,
    scaleUpCooldownMinutes: 5,
    scaleDownCheckMinutes: 15,
  });

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving config:', config);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-gray-900">
          Auto Scaler
        </h1>
        <p className="text-gray-500 mt-2">
          Configure automated resource scaling policies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-8">
            {/* Header with Toggle */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Scaling Configuration
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Enable and configure auto-scaling rules
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => handleChange('autoScalingEnabled', !config.autoScalingEnabled)}
                className={`
                  relative w-14 h-8 rounded-full transition-colors duration-300
                  focus:outline-none focus:ring-2 focus:ring-accent/50
                  ${config.autoScalingEnabled ? 'bg-green-400' : 'bg-gray-300'}
                `}
              >
                <div 
                  className={`
                    absolute top-1 left-1 w-6 h-6 bg-white rounded-full 
                    transition-transform duration-300
                    ${config.autoScalingEnabled ? 'translate-x-6' : 'translate-x-0'}
                  `} 
                />
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Minimum VMs"
                value={config.minVMs}
                onChange={(e) => handleChange('minVMs', parseInt(e.target.value) || 0)}
                type="number"
                min="1"
              />

              <InputField
                label="Maximum VMs"
                value={config.maxVMs}
                onChange={(e) => handleChange('maxVMs', parseInt(e.target.value) || 0)}
                type="number"
                min="1"
              />

              <InputField
                label="Scale Up Cooldown (minutes)"
                value={config.scaleUpCooldownMinutes}
                onChange={(e) => handleChange('scaleUpCooldownMinutes', parseInt(e.target.value) || 0)}
                type="number"
                min="1"
              />

              <InputField
                label="Scale Down Check (minutes)"
                value={config.scaleDownCheckMinutes}
                onChange={(e) => handleChange('scaleDownCheckMinutes', parseInt(e.target.value) || 0)}
                type="number"
                min="1"
              />
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSave}
                className="
                  flex items-center gap-2 px-6 py-3 
                  bg-accent text-white rounded-xl 
                  font-semibold text-sm
                  hover:bg-accent/90 
                  transition-all
                "
              >
                <Save className="w-4 h-4" />
                Save Configuration
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Tips Card */}
          <GlassCard className="p-6 bg-gradient-to-br from-accent/20 to-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                <Sliders className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-bold text-gray-900">
                Optimization Tips
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Lower cooldown periods enable faster response to traffic spikes but may increase costs. 
              Balance responsiveness with resource efficiency.
            </p>
          </GlassCard>

          {/* Thresholds Card */}
          <GlassCard className="p-6">
            <h3 className="font-bold text-gray-900 mb-5">
              Scaling Thresholds
            </h3>
            <div className="space-y-5">
              <ThresholdRow 
                icon={TrendingUp}
                label="Scale Up CPU" 
                threshold="> 80%"
                percent={80}
                color="bg-status-warning"
              />
              <ThresholdRow 
                icon={TrendingDown}
                label="Scale Down CPU" 
                threshold="< 30%"
                percent={30}
                color="bg-status-running"
              />
            </div>
          </GlassCard>

          {/* Current Status */}
          <GlassCard className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">
              Current Status
            </h3>
            <div className="space-y-3">
              <StatusRow label="Auto Scaling" value={config.autoScalingEnabled ? "Enabled" : "Disabled"} active={config.autoScalingEnabled} />
              <StatusRow label="Active VMs" value="5" />
              <StatusRow label="VM Range" value={`${config.minVMs} - ${config.maxVMs}`} />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function InputField({ label, value, onChange, type = "text", min }) {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        className="
          w-full px-4 py-3 rounded-xl
          bg-white/50 border border-gray-200
          text-gray-900 font-semibold
          focus:outline-none focus:ring-2 focus:ring-accent/50
          transition-all
        "
      />
    </div>
  )
}

function ThresholdRow({ icon: Icon, label, threshold, percent, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-900">{threshold}</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function StatusRow({ label, value, active }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${
        active !== undefined 
          ? (active ? 'text-green-600' : 'text-red-600')
          : 'text-gray-900'
      }`}>
        {value}
      </span>
    </div>
  )
}
