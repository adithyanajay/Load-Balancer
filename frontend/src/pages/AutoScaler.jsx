import { autoScalerConfig } from "../data/mockData";

export default function AutoScaler() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Auto Scaler</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl">
        {/* Min VMs */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Minimum VMs
          </label>
          <input
            type="number"
            value={autoScalerConfig.minVMs}
            className="w-full border rounded px-3 py-2"
            readOnly
          />
        </div>

        {/* Max VMs */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Maximum VMs
          </label>
          <input
            type="number"
            value={autoScalerConfig.maxVMs}
            className="w-full border rounded px-3 py-2"
            readOnly
          />
        </div>

        {/* Auto Scaling Enabled */}
        <div className="mb-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={autoScalerConfig.autoScalingEnabled}
            readOnly
          />
          <label className="text-sm font-medium">
            Auto Scaling Enabled
          </label>
        </div>

        {/* Cooldown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Scale Up Cooldown (minutes)
          </label>
          <input
            type="number"
            value={autoScalerConfig.scaleUpCooldownMinutes}
            className="w-full border rounded px-3 py-2"
            readOnly
          />
        </div>

        {/* Scale Down */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Scale Down Check Interval (minutes)
          </label>
          <input
            type="number"
            value={autoScalerConfig.scaleDownCheckMinutes}
            className="w-full border rounded px-3 py-2"
            readOnly
          />
        </div>

        {/* Save Button (Dummy) */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded opacity-70 cursor-not-allowed"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
