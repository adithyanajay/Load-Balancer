import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 bg-white p-4 shadow-md">
      <h2 className="text-xl font-bold mb-6">Load Balancer</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/vms">Active VMs</Link>
        <Link to="/monitor">System Monitor</Link>
        <Link to="/autoscaler">Auto Scaler</Link>
      </nav>
    </div>
  );
}
