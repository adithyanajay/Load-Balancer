import React from 'react';
import { Bell, Sun } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

const TopBar = () => {
  return (
    <header className="px-8 py-4 z-30">
      <div className="mx-auto max-w-7xl">
        <GlassCard className="!p-4 flex items-center justify-between !rounded-2xl">
          {/* Left: Search or breadcrumb space */}
          <div className="flex items-center gap-2">
  <img
    src="/logo.png"   // change to your logo path
    alt="DynamiQ Logo"
    className="w-8 h-8 object-contain"
  />
  <h1 className="text-lg font-semibold text-gray-700">DynamiQ-Load Balancer</h1>
</div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl text-gray-500 hover:bg-white/50 hover:text-gray-900 transition-colors">
              <Sun className="w-5 h-5" />
            </button>
            
            <button className="p-2 rounded-xl text-gray-500 hover:bg-white/50 hover:text-gray-900 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">System Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-300 overflow-hidden ring-2 ring-white/50">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Admin" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </header>
  );
};

export default TopBar;
