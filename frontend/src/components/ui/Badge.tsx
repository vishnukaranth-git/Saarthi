import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'paytm' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ children, className, variant = 'neutral', size = 'sm', ...props }: BadgeProps) {
  const variantStyles = {
    paytm: 'bg-[#e8f7fd] text-[#006686] border border-[#2bc6ff]/30 dark:bg-[#002970]/40 dark:text-[#2bc6ff] dark:border-[#00baf2]/30',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    outline: 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-lg',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 leading-none tracking-wide transition-colors', variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </span>
  );
}
