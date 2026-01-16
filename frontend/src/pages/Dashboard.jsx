import StatCard from "../components/StatCard";
import { dashboardOverview } from "../data/mockData";
import { Server, Zap, AlertTriangle, Layers } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">System Overview</h1>
        <p className="text-gray-500 mt-1">Real-time infrastructure metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active VMs"
          value={dashboardOverview.activeVMs}
          icon={Server}
          trend={12}
        />

        <StatCard
          title="Underloaded VMs"
          value={dashboardOverview.underloadedVMs}
          icon={Layers}
          className="bg-purple-50/50"
        />

        <StatCard
          title="Overloaded VMs"
          value={dashboardOverview.overloadedVMs}
          icon={AlertTriangle}
          className="bg-status-warning/10 border-status-warning/20"
        />

        <StatCard
          title="Queued Requests"
          value={dashboardOverview.queuedRequests}
          icon={Zap}
          className="bg-accent/10 border-accent/20"
        />
      </div>

      {/* Additional Dashboard widgets could go here */}
    </div>
  );
}
