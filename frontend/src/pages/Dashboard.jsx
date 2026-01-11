import StatCard from "../components/StatCard";
import { dashboardOverview } from "../data/mockData";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active VMs"
          value={dashboardOverview.activeVMs}
        />

        <StatCard
          title="Underloaded VMs"
          value={dashboardOverview.underloadedVMs}
        />

        <StatCard
          title="Overloaded VMs"
          value={dashboardOverview.overloadedVMs}
        />

        <StatCard
          title="Queued Requests"
          value={dashboardOverview.queuedRequests}
        />
      </div>
    </div>
  );
}
