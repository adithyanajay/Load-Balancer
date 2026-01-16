import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ActiveVMs from "./pages/ActiveVMs";
import SystemMonitor from "./pages/SystemMonitor";
import AutoScaler from "./pages/AutoScaler";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/active-vms" element={<ActiveVMs />} />
          <Route path="/system-monitor" element={<SystemMonitor />} />
          <Route path="/auto-scaler" element={<AutoScaler />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
