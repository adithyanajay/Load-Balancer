import { NavLink } from "react-router-dom"
import { LayoutDashboard, Server } from "lucide-react"
import { GlassCard } from "../ui/GlassCard"

export default function Sidebar() {
  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/vms", label: "VMs", icon: Server },
  ]

  return (
    <GlassCard className="h-full p-4">
      <nav className="space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl ${
                isActive ? "bg-purple-200" : "hover:bg-white/40"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </GlassCard>
  )
}

