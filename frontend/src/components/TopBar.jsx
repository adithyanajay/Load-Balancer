import React from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import { GlassCard } from './GlassCard';

const TopBar = () => {
  return (
    <header className="px-6 py-4 z-30">
      <div className="mx-auto max-w-7xl">
        <GlassCard className="!p-3 !px-5 flex items-center justify-between !rounded-full !bg-glass-bg/80 backdrop-blur-2xl">

          {/* Left: Placeholder for potential future content */}
          <div className="flex items-center gap-4">
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-gray-500 hover:bg-white/50 hover:text-gray-900 transition-colors">
              <Sun className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-white/50 hover:text-gray-900 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">System Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-purple-300 ring-2 ring-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </header>
  );
};

export default TopBar;
