'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMerchant } from '@/context/MerchantContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Loader2 } from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, loading } = useMerchant();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = pathname === '/login' || pathname === '/signup' || pathname === '/';

  useEffect(() => {
    if (!loading && !session && !isPublicRoute) {
      router.replace('/login');
    }
  }, [loading, session, isPublicRoute, router]);

  // If on a public route, render plain without dashboard shell
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Loading session screen
  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#faf8ff] dark:bg-[#0b0f19] text-slate-700 dark:text-slate-200">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft dark:bg-[#111827] border border-slate-100 dark:border-slate-800 mb-4">
          <Loader2 className="h-7 w-7 animate-spin text-[#00baf2]" />
        </div>
        <p className="text-sm font-bold text-[#002970] dark:text-white">Connecting to Saarthi AI...</p>
        <p className="text-xs text-slate-400 mt-1">Verifying merchant credentials</p>
      </div>
    );
  }

  // If not authenticated and redirecting, render minimal loader to avoid flash
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-slate-800 antialiased dark:bg-[#080e1a] dark:text-slate-100 transition-colors">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
