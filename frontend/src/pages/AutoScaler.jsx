import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Save, Zap, TrendingUp, TrendingDown } from 'lucide-react';

import AutoscalerCard from "../components/dashboard/AutoscalerCard"



export default function AutoScaler() {
  const [config, setConfig] = useState({
    min_instances: 2,
    max_instances: 10,
    scale_up_count: 1,
    scale_down_count: 1,
    cooldown_seconds: 1,
  });

  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    if (config.min_instances < 1 || config.min_instances > 10) {
      return "Min instances must be between 1 and 10";
    }

    if (config.max_instances < 2 || config.max_instances > 10) {
      return "Max instances must be between 2 and 10";
    }

    if (config.min_instances > config.max_instances) {
      return "Min instances cannot be greater than max instances";
    }

    if (config.scale_up_count < 1 || config.scale_up_count > config.max_instances) {
      return "Invalid scale up count";
    }

    if (config.scale_down_count < 1 || config.scale_down_count > config.max_instances) {
      return "Invalid scale down count";
    }

    if (config.cooldown_seconds < 1 || config.cooldown_seconds > 120) {
      return "Cooldown must be between 1 and 120 seconds";
    }

    return null;
  };

  // ---------------- SAVE ----------------
  const handleSave = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setConfirmOpen(true);
  };

  const confirmSave = async () => {
    setConfirmOpen(false);
    setLoading(true);

    try {
      const res = await fetch("http://34.204.172.76:8080/admin/autoscaler/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error("Failed to update config");

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">

      {/* ERROR POPUP */}
      {error && (
        <Popup
          title="Error"
          message={error}
          onClose={() => setError(null)}
          type="error"
        />
      )}

      {/* CONFIRM POPUP */}
      {confirmOpen && (
        <Popup
          title="Confirm Update"
          message="Are you sure you want to update autoscaler configuration?"
          onClose={() => setConfirmOpen(false)}
          onConfirm={confirmSave}
          type="confirm"
        />
      )}

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-display font-bold text-gray-900">
          Auto Scaler
        </h1>
        <p className="text-gray-500 mt-2">
          Configure automated scaling policies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MAIN CARD */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8">

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-xl font-bold">Scaling Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputField label="Min Instances" value={config.min_instances}
                onChange={(v) => handleChange("min_instances", v)} />

              <InputField label="Max Instances" value={config.max_instances}
                onChange={(v) => handleChange("max_instances", v)} />

              <InputField label="Scale Up Count" value={config.scale_up_count}
                onChange={(v) => handleChange("scale_up_count", v)} />

              <InputField label="Scale Down Count" value={config.scale_down_count}
                onChange={(v) => handleChange("scale_down_count", v)} />

              <InputField label="Cooldown (seconds)" value={config.cooldown_seconds}
                onChange={(v) => handleChange("cooldown_seconds", v)} />

            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save"}
              </button>
            </div>

          </GlassCard>
        </div>

        {/* SIDE INFO */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="font-bold mb-4">Thresholds</h3>
            <ThresholdRow icon={TrendingUp} label="Scale Up" threshold="> 80%" percent={80} />
            <ThresholdRow icon={TrendingDown} label="Scale Down" threshold="< 20%" percent={20} />
          </GlassCard>
        
            <AutoscalerCard />
         
        </div>

      </div>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200"
      />
    </div>
  );
}

function Popup({ title, message, onClose, onConfirm, type }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200">
            Cancel
          </button>

          {type === "confirm" && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-accent text-white"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ThresholdRow({ icon: Icon, label, threshold, percent }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </div>
        <span>{threshold}</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div className="bg-accent h-full rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}