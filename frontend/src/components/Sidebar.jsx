import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Server, Activity, Sliders } from 'lucide-react';
import { GlassCard } from './GlassCard';

const Sidebar = ({ className }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/active-vms', label: 'Active VMs', icon: Server },
    { path: '/system-monitor', label: 'System Monitor', icon: Activity },
    { path: '/auto-scaler', label: 'Auto Scaler', icon: Sliders },
  ];

  return (
    <GlassCard className={`flex flex-col h-full !p-4 ${className} !rounded-3xl`}>
      <div className="flex items-center gap-3 px-4 py-6 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/20">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-xl font-display font-semibold tracking-tight text-gray-900">
          DynamiQ
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                ? 'bg-primary/20 text-accent font-medium shadow-sm'
                : 'text-gray-500 hover:bg-white/40 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[15px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 py-6">
        <div className="text-xs font-medium text-gray-400 text-center">

        </div>
      </div>
    </GlassCard>
  );
};

export default Sidebar;
