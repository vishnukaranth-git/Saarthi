'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useMerchant } from '@/context/MerchantContext';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Megaphone, Plus, ExternalLink, Sparkles, Filter } from 'lucide-react';
import { Campaign } from '@/types';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default function CampaignsPage() {
  const { merchant } = useMerchant();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadCampaigns = useCallback(async () => {
    if (!merchant?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setCampaigns(data);
      }
    } catch (err) {
      console.warn('Campaigns load note:', err);
    } finally {
      setIsLoading(false);
    }
  }, [merchant?.id]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const filteredCampaigns = campaigns.filter((c) => {
    if (statusFilter === 'ALL') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#002970] text-white dark:bg-[#00baf2] dark:text-[#001645]">
              <Megaphone className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#002970] dark:text-white">
              Merchant Campaigns
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Autonomous marketing campaigns designed, localized, and dispatched by Saarthi AI
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/goals">
            <Button variant="paytm" size="sm" rightIcon={<Plus className="h-4 w-4" />}>
              Create with AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Demo disclaimer notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
        <span className="font-bold">Mock Paytm API — Hackathon Demo:</span> Campaigns are dispatched through mock Paytm notification interfaces and n8n webhook pipelines for safe demonstration.
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'RUNNING', 'SCHEDULED', 'COMPLETED', 'DRAFT'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === tab
                ? 'bg-[#002970] text-white dark:bg-[#00baf2] dark:text-[#001645]'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
            }`}
          >
            {tab === 'ALL' ? 'All Campaigns' : tab}
          </button>
        ))}
      </div>

      {/* Campaigns Table / Cards */}
      <Card className="p-6">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : filteredCampaigns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
            <Megaphone className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-[#002970] dark:text-white">
              No Campaigns Found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              You do not have any campaigns under this filter. Launch a goal in Saarthi to create targeted promotional campaigns automatically.
            </p>
            <div className="mt-4">
              <Link href="/goals">
                <Button variant="primary" size="sm">
                  Launch New Goal
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Offer & Message</th>
                  <th className="pb-3 px-3">Target Segment</th>
                  <th className="pb-3 px-3">Language</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Created</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredCampaigns.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 pl-2 max-w-xs sm:max-w-sm">
                      <p className="font-bold text-[#002970] dark:text-white truncate">
                        {c.offer}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {c.message}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="paytm">{c.target_segment || 'All'}</Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {c.language || 'English'}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          c.status === 'RUNNING'
                            ? 'paytm'
                            : c.status === 'COMPLETED'
                            ? 'success'
                            : c.status === 'FAILED'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {formatDateTime(c.created_at)}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <Link href={`/campaigns/${c.id}`}>
                        <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
                          Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
