import { NavLink } from "react-router-dom"
import { LayoutDashboard, Server, Zap } from "lucide-react"
import { GlassCard } from "../ui/GlassCard"

export default function Sidebar() {
  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/vms", label: "Virtual Machines", icon: Server },
    { path: "/autoscaler", label: "Auto Scaler", icon: Zap },
  ]

  return (
    <GlassCard className="h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="px-6 py-6 border-b border-white/30">
        <h2 className="text-2xl font-display font-bold text-gray-900">
    Threshold Load Balancer
        </h2>
        <p className="text-xs text-gray-500 mt-1.5">Infrastructure Control</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all whitespace-nowrap ${
                isActive 
                  ? "bg-accent/20 text-accent font-semibold" 
                  : "text-gray-600 hover:bg-white/40 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/30">
        <p className="text-xs text-gray-400">Version 1.0.0</p>
      </div>
    </GlassCard>
  )
}
