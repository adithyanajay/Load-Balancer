import { Routes, Route } from "react-router-dom"
import Dashboard from "../pages/Dashboard.jsx"
import VMs from "../pages/VMs.jsx"
import VMDetails from "../pages/VMDetails.jsx"
import AutoScaler from "../pages/AutoScaler.jsx"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/vms" element={<VMs />} />
      <Route path="/vms/:vmId" element={<VMDetails />} />
      <Route path="/autoscaler" element={<AutoScaler />} />
    </Routes>
  )
}
