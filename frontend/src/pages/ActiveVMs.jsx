import { activeVMsData } from "../data/mockData";

export default function ActiveVMs() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Active VMs</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">VM ID</th>
              <th className="p-4">State</th>
              <th className="p-4">Load (%)</th>
              <th className="p-4">Task Count</th>
            </tr>
          </thead>

          <tbody>
            {activeVMsData.map((vm) => (
              <tr key={vm.vmId} className="border-t">
                <td className="p-4">{vm.vmId}</td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      vm.state === "RUNNING"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vm.state}
                  </span>
                </td>

                <td className="p-4">{vm.loadPercent}%</td>
                <td className="p-4">{vm.taskCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
