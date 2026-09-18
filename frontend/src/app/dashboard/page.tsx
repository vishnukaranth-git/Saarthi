'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useMerchant } from '@/context/MerchantContext';
import { supabase } from '@/lib/supabase';
import { HeroCommand } from '@/components/dashboard/HeroCommand';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart';
import { Card, CardTitle, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { ArrowRight, Megaphone, Target, Clock, AlertCircle } from 'lucide-react';
import type { Campaign, AgentTask } from '@/types';
import { formatDateTime } from '@/lib/utils';

export default function DashboardPage() {
  const { merchant, profile, loading: merchantLoading } = useMerchant();

  const [loadingData, setLoadingData] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [activeCampaignsCount, setActiveCampaignsCount] = useState(0);
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [recentTasks, setRecentTasks] = useState<AgentTask[]>([]);
  const [chartData, setChartData] = useState<{ date: string; sales: number }[]>([]);
  const [hasRealData, setHasRealData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadMerchantDashboardData = useCallback(async (merchantId: string) => {
    try {
      setLoadingData(true);
      setFetchError(null);

      // 1. Fetch transactions for this merchant
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('transaction_time', { ascending: false });

      if (txError) {
        console.warn('Transaction fetch note:', txError.message);
      }

      if (txData && txData.length > 0) {
        setHasRealData(true);
        const sum = txData.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        setTotalSales(sum);
        setTransactionsCount(txData.length);

        // Group by date for chart
        const dateMap: Record<string, number> = {};
        txData.slice(0, 30).forEach((tx) => {
          const d = new Date(tx.transaction_time).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
          });
          dateMap[d] = (dateMap[d] || 0) + Number(tx.amount || 0);
        });

        const points = Object.entries(dateMap).map(([date, sales]) => ({ date, sales }));
        setChartData(points.reverse());
      } else {
        setTotalSales(0);
        setTransactionsCount(0);
        setChartData([]);
      }

      // 2. Fetch customer count for this merchant
      const { count: custCount, error: custError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('merchant_id', merchantId);

      if (!custError && custCount !== null) {
        setCustomersCount(custCount);
      }

      // 3. Fetch campaigns for this merchant
      const { data: campData, error: campError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });

      if (!campError && campData) {
        const active = campData.filter((c) => c.status === 'RUNNING' || c.status === 'SCHEDULED');
        setActiveCampaignsCount(active.length);
        setRecentCampaigns(campData.slice(0, 3));
      }

      // 4. Fetch recent tasks
      const { data: taskData, error: taskError } = await supabase
        .from('agent_tasks')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!taskError && taskData) {
        setRecentTasks(taskData);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading dashboard metrics';
      setFetchError(msg);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (merchant?.id) {
      loadMerchantDashboardData(merchant.id);
    } else if (!merchantLoading) {
      setLoadingData(false);
    }
  }, [merchant?.id, merchantLoading, loadMerchantDashboardData]);

  const merchantDisplayName = merchant?.business_name || profile?.full_name || 'Partner';

  return (
    <div className="space-y-6">
      {fetchError && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Notice: {fetchError}</span>
        </div>
      )}

      {/* Hero Saarthi Command Section */}
      <HeroCommand merchantName={merchantDisplayName} />

      {/* KPI Cards */}
      {loadingData || merchantLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <KpiCards
          totalSales={totalSales}
          transactionsCount={transactionsCount}
          customersCount={customersCount}
          activeCampaignsCount={activeCampaignsCount}
          hasData={hasRealData}
        />
      )}

      {/* Charts & Tasks Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart (2 columns) */}
        <div className="lg:col-span-2">
          <SalesTrendChart
            data={chartData}
            title="Sales Velocity & Trends"
            description="Verified sales trends processed for your business"
            isSimulation={!hasRealData}
          />
        </div>

        {/* Recent Autonomous Tasks (1 column) */}
        <div className="space-y-4">
          <Card className="p-6">
            <CardHeader className="mb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-[#00baf2]" />
                <span>Recent AI Goals</span>
              </CardTitle>
              <Link
                href="/goals"
                className="text-xs font-bold text-[#00baf2] hover:underline"
              >
                View all
              </Link>
            </CardHeader>

            {recentTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  No goals executed yet
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Enter your business target above to activate Saarthi autonomous agents.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((t) => (
                  <Link
                    key={t.id}
                    href={`/goals/${t.id}`}
                    className="block rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors dark:border-slate-800 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-slate-400">
                        {formatDateTime(t.created_at)}
                      </span>
                      <Badge
                        variant={
                          t.status === 'COMPLETED'
                            ? 'success'
                            : t.status === 'RUNNING'
                            ? 'paytm'
                            : t.status === 'FAILED'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {t.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-[#002970] dark:text-white line-clamp-1">
                      {t.goal}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Active Campaigns Quick Preview */}
          <Card className="p-6">
            <CardHeader className="mb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-[#00baf2]" />
                <span>Active Campaigns</span>
              </CardTitle>
              <Link
                href="/campaigns"
                className="text-xs font-bold text-[#00baf2] hover:underline"
              >
                View all
              </Link>
            </CardHeader>

            {recentCampaigns.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  No active campaigns
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Saarthi autonomously builds high-conversion campaigns when goals are set.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCampaigns.map((c) => (
                  <Link
                    key={c.id}
                    href={`/campaigns/${c.id}`}
                    className="block rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors dark:border-slate-800 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="paytm">{c.target_segment || 'All Customers'}</Badge>
                      <span className="text-[10px] text-slate-400">{c.language || 'English'}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#002970] dark:text-white line-clamp-1">
                      {c.offer}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
