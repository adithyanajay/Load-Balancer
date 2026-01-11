import { systemMonitorData } from "../data/mockData";

export default function SystemMonitor() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">System Monitor</h1>

      <div className="space-y-6">
        {systemMonitorData.map((vm) => (
          <div
            key={vm.vmId}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold mb-4">
              {vm.vmId}
            </h2>

            {/* CPU */}
            <div className="mb-3">
              <p className="text-sm mb-1">
                CPU Usage: {vm.cpuUsage}%
              </p>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${vm.cpuUsage}%` }}
                />
              </div>
            </div>

            {/* Memory */}
            <div className="mb-3">
              <p className="text-sm mb-1">
                Memory Usage: {vm.memoryUsage}%
              </p>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${vm.memoryUsage}%` }}
                />
              </div>
            </div>

            {/* Network */}
            <div>
              <p className="text-sm mb-1">
                Network Usage: {vm.networkUsage} Mbps
              </p>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="bg-purple-500 h-2 rounded"
                  style={{
                    width: `${Math.min(vm.networkUsage * 3, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
