import React from 'react';
import { GlassCard } from '../ui/GlassCard';

export default function StatCard({ title, value, icon: Icon, trend, className }) {
  return (
    <GlassCard hoverEffect className={`flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</span>
        {Icon && <Icon className="w-5 h-5 text-accent opacity-80" />}
      </div>

      <div className="flex items-end justify-between">
        <div className="text-3xl font-display font-bold text-gray-900 leading-none">
          {value}
        </div>

        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-status-running/20 text-green-700' : 'bg-status-stopped/20 text-red-700'
            }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </GlassCard>
  );
}
