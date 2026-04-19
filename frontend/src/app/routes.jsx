import { Routes, Route } from "react-router-dom"

import Dashboard from "../pages/Dashboard.jsx"
import VMs from "../pages/VMs.jsx"
import VMDetails from "../pages/VMDetails.jsx"
import AutoScaler from "../pages/AutoScaler.jsx"
import SystemMonitor from "../pages/SystemMonitor"
import Login from "../pages/Login.jsx"
import Profile from "../pages/Profile.jsx"

import Layout from "../components/layout/Layout"

export default function AppRoutes() {
  return (
    <Routes>


      <Route path="/login" element={<Login />} />

     
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vms" element={<VMs />} />
        <Route path="/vms/:vmId" element={<VMDetails />} />
        <Route path="/autoscaler" element={<AutoScaler />} />
        <Route path="/system-monitor" element={<SystemMonitor />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

    </Routes>
  )
}