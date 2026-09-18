'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { IndianRupee, ArrowUpRight, ShoppingCart, Users, Megaphone } from 'lucide-react';

interface KpiCardsProps {
  totalSales: number;
  transactionsCount: number;
  customersCount: number;
  activeCampaignsCount: number;
  salesGrowth?: number;
  txGrowth?: number;
  hasData: boolean;
}

export function KpiCards({
  totalSales,
  transactionsCount,
  customersCount,
  activeCampaignsCount,
  salesGrowth = 0,
  txGrowth = 0,
  hasData,
}: KpiCardsProps) {
  const cards = [
    {
      title: 'Total Sales',
      value: formatCurrency(totalSales),
      badge: salesGrowth !== 0 ? `${salesGrowth > 0 ? '+' : ''}${salesGrowth}%` : undefined,
      badgePositive: salesGrowth >= 0,
      icon: IndianRupee,
      subtitle: hasData ? 'vs. previous cycle' : 'No sales recorded yet',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    {
      title: 'Transactions',
      value: formatNumber(transactionsCount),
      badge: txGrowth !== 0 ? `${txGrowth > 0 ? '+' : ''}${txGrowth}%` : undefined,
      badgePositive: txGrowth >= 0,
      icon: ShoppingCart,
      subtitle: hasData ? 'verified payments' : 'No transactions recorded',
      iconBg: 'bg-[#e8f7fd] text-[#006686] dark:bg-[#002970]/40 dark:text-[#2bc6ff]',
    },
    {
      title: 'Total Customers',
      value: formatNumber(customersCount),
      badge: undefined,
      badgePositive: true,
      icon: Users,
      subtitle: hasData ? 'active customer profiles' : 'No customer records',
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
    },
    {
      title: 'Active Campaigns',
      value: formatNumber(activeCampaignsCount),
      badge: undefined,
      badgePositive: true,
      icon: Megaphone,
      subtitle: hasData ? 'running AI marketing' : 'No active campaigns',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} hoverable className="relative overflow-hidden p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-[#002970] dark:text-white">
                {card.value}
              </span>
              {card.badge && (
                <span
                  className={`inline-flex items-center text-xs font-semibold ${
                    card.badgePositive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  <ArrowUpRight className="h-3 w-3" />
                  {card.badge}
                </span>
              )}
            </div>

            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              {card.subtitle}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
