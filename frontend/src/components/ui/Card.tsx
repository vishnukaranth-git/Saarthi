'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = false, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-100',
        'border border-slate-100 dark:border-slate-800/80',
        'rounded-2xl p-5 md:p-6 shadow-soft transition-colors duration-200',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4 flex items-center justify-between', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-base md:text-lg font-bold text-[#002970] dark:text-white tracking-tight', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5', className)}>{children}</p>;
}
