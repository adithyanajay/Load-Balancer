import { Routes, Route } from "react-router-dom"
import Layout from "../components/layout/Layout.jsx"
import Dashboard from "../pages/Dashboard.jsx"
import VMs from "../pages/VMs.jsx"
import VMDetails from "../pages/VMDetails.jsx"

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vms" element={<VMs />} />
        <Route path="/vms/:vmId" element={<VMDetails />} />
      </Routes>
    </Layout>
  )
}

