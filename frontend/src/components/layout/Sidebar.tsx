'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Target,
  Megaphone,
  BarChart3,
  Users,
  Brain,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/memory', label: 'AI Memory', icon: Brain },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Mobile top header close */}
        <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#002970] text-white">
              <Sparkles className="h-4 w-4 text-[#00baf2]" />
            </div>
            <span className="font-bold text-sm text-[#002970] dark:text-white">Paytm Saarthi</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-[#e8f7fd] text-[#002970] dark:bg-[#002970]/50 dark:text-[#2bc6ff] shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 transition-transform duration-200 group-hover:scale-110',
                    isActive
                      ? 'text-[#00baf2] dark:text-[#2bc6ff]'
                      : 'text-slate-400 dark:text-slate-500'
                  )}
                />
                <span>{item.label}</span>
                {item.href === '/goals' && (
                  <span className="ml-auto rounded-full bg-[#00baf2]/20 px-2 py-0.5 text-[10px] font-bold text-[#006686] dark:text-[#2bc6ff]">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Autonomous Teammate status pill at bottom of sidebar */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Saarthi Engine
          </span>
        </div>
        <p className="text-xs font-semibold text-[#002970] dark:text-slate-200">
          Ready to execute goals
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Autonomous multi-agent coordinator
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0b0f19] h-[calc(100vh-4rem)] sticky top-16 transition-colors">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0b0f19] shadow-2xl z-50 transition-transform animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
