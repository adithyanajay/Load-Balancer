import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function GlassCard({ children, className, hoverEffect = false, ...props }) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl p-6 transition-all duration-200',
          hoverEffect && 'hover:-translate-y-1 cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
