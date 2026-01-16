import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function GlassCard({ children, className, hoverEffect = false, ...props }) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-glass-bg backdrop-blur-xl border border-glass-border shadow-glass rounded-2xl p-6 transition-all duration-300 ease-out',
          hoverEffect && 'hover:-translate-y-1 hover:shadow-lg',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
