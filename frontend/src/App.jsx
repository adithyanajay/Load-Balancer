import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import ActiveVMs from "./pages/ActiveVMs";
import SystemMonitor from "./pages/SystemMonitor";
import AutoScaler from "./pages/AutoScaler";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";


function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-100">
        <div className="flex-1 bg-gray-100 p-6">
  <TopBar />
  

          <Routes>
             <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/vms" element={<ActiveVMs />} />
            <Route path="/monitor" element={<SystemMonitor />} />
            <Route path="/autoscaler" element={<AutoScaler />} />
          </Routes>
           </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
