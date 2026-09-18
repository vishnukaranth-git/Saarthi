'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useMerchant } from '@/context/MerchantContext';
import { getInitials } from '@/lib/utils';
import {
  Sun,
  Moon,
  Bell,
  Search,
  Sparkles,
  LogOut,
  ChevronDown,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { merchant, profile, signOut } = useMerchant();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      router.push(`/goals?prompt=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  const displayName = merchant?.business_name || profile?.full_name || 'Business Partner';
  const initials = getInitials(displayName);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-[#0b0f19]/95 md:px-6">
      {/* Left brand & mobile toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#002970] text-white shadow-sm shadow-[#002970]/20">
            <Sparkles className="h-4 w-4 text-[#6bd7ff]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-[#002970] dark:text-white text-base">
                Saarthi
              </span>
              <span className="rounded bg-[#00baf2]/10 px-1 py-0.5 text-[10px] font-bold text-[#00baf2]">
                AI
              </span>
            </div>
            <p className="hidden text-[10px] font-medium text-slate-400 dark:text-slate-400 sm:block -mt-0.5">
              Your AI Business Teammate
            </p>
          </div>
        </Link>
      </div>

      {/* Center Search / Ask Saarthi shortcut */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Ask Saarthi anything or set a goal..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-[#00baf2] focus:ring-1 focus:ring-[#00baf2]"
          />
        </div>
      </form>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 text-[#002970]" />
          ) : (
            <Sun className="h-4 w-4 text-amber-400" />
          )}
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#00baf2]" />
        </button>

        {/* Merchant Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#002970] text-xs font-bold text-white shadow-sm dark:bg-[#00baf2] dark:text-[#001645]">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-bold leading-tight text-slate-800 dark:text-white truncate max-w-[120px]">
                {merchant?.business_name || profile?.full_name || 'Merchant'}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">
                {merchant?.business_type || 'Retailer'}
              </p>
            </div>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* User Dropdown */}
          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-card dark:border-slate-800 dark:bg-[#111827] z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-[#002970] dark:text-white truncate">
                  {merchant?.business_name || 'My Store'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {profile?.email || 'authenticated'}
                </p>
              </div>
              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Settings & Profile
                </Link>
                <button
                  onClick={async () => {
                    setUserMenuOpen(false);
                    await signOut();
                    router.push('/login');
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors mt-1"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
