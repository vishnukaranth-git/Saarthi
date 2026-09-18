'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ChartPoint {
  date: string;
  sales: number;
  transactions?: number;
}

interface SalesTrendChartProps {
  data: ChartPoint[];
  title?: string;
  description?: string;
  isSimulation?: boolean;
}

export function SalesTrendChart({
  data,
  title = 'Sales Performance',
  description = 'Real-time sales tracking across business periods',
  isSimulation = false,
}: SalesTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-80 flex flex-col items-center justify-center text-center p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
          <BarChart3 className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-[#002970] dark:text-white">
          No Sales Data Recorded Yet
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Transactions recorded through your merchant account will automatically reflect in this real-time sales overview.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            {isSimulation && (
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                Demo Simulation
              </span>
            )}
          </div>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00baf2" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00baf2" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-card dark:border-slate-800 dark:bg-[#111827]">
                      <p className="text-[11px] font-medium text-slate-400">{payload[0].payload.date}</p>
                      <p className="text-sm font-bold text-[#002970] dark:text-[#00baf2]">
                        {formatCurrency(payload[0].value as number)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#00baf2"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
