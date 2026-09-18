'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Campaign } from '@/types';
import { formatDateTime } from '@/lib/utils';
import {
  ArrowLeft,
  Megaphone,
  Sparkles,
  Send,
  Languages,
  Users,
  Clock,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<{ id: string; name: string; price: number }[]>([]);

  const loadCampaignDetail = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        setCampaign(data);

        // Fetch sample products for this merchant
        const { data: prodData } = await supabase
          .from('products')
          .select('id, name, price')
          .eq('merchant_id', data.merchant_id)
          .limit(4);

        if (prodData) {
          setProducts(prodData);
        }
      }
    } catch (err) {
      console.warn('Campaign detail note:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCampaignDetail();
  }, [loadCampaignDetail]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-9 w-32 rounded-xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-72 w-full rounded-3xl" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-card dark:border-slate-800 dark:bg-[#111827] max-w-lg mx-auto">
        <Megaphone className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-[#002970] dark:text-white">
          Campaign Not Found
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          The requested campaign either does not exist or does not belong to your merchant account.
        </p>
        <div className="mt-5">
          <Link href="/campaigns">
            <Button variant="primary" size="sm">
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/campaigns">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Campaigns
          </Button>
        </Link>
        <Badge
          variant={
            campaign.status === 'RUNNING'
              ? 'paytm'
              : campaign.status === 'COMPLETED'
              ? 'success'
              : 'neutral'
          }
        >
          {campaign.status}
        </Badge>
      </div>

      {/* Prominent Hackathon Demo Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-300/80 bg-amber-50 p-4 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-300 text-xs">
        <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div>
          <p className="font-bold">Mock Paytm API — Hackathon Demo</p>
          <p className="mt-0.5 text-slate-600 dark:text-slate-300 leading-relaxed">
            This campaign was dispatched via the mock Paytm API integration simulator and n8n webhook pipeline. Production Paytm API access is not active in this hackathon environment.
          </p>
        </div>
      </div>

      {/* Main Campaign Overview Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#00baf2]">
          <Sparkles className="h-4 w-4" />
          <span>AI Generated Campaign</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#002970] dark:text-white">
          {campaign.offer}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Created on {formatDateTime(campaign.created_at)}
        </p>

        {/* Campaign Attributes Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Users className="h-3.5 w-3.5" />
              <span>Target Segment</span>
            </div>
            <p className="text-sm font-bold text-[#002970] dark:text-white">
              {campaign.target_segment || 'All Customers'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Languages className="h-3.5 w-3.5" />
              <span>Language</span>
            </div>
            <p className="text-sm font-bold text-[#002970] dark:text-white">
              {campaign.language || 'English'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Send className="h-3.5 w-3.5" />
              <span>Dispatch Channel</span>
            </div>
            <p className="text-sm font-bold text-[#002970] dark:text-white">
              Paytm SMS / App Push (Mock)
            </p>
          </div>
        </div>

        {/* Message Copy Box */}
        <div className="mt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Dispatched Customer Message Copy
          </label>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs sm:text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 font-sans leading-relaxed">
            &ldquo;{campaign.message}&rdquo;
          </div>
        </div>

        {/* Products involved */}
        {products.length > 0 && (
          <div className="mt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Featured Products in Campaign
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-xs dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{p.name}</span>
                  <span className="font-bold text-[#002970] dark:text-[#00baf2]">₹{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
          <h3 className="text-sm font-bold text-[#002970] dark:text-white mb-4">
            Execution Timeline
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Goal Formulated & Reasoned</p>
                <p className="text-[11px] text-slate-400">Supervisor assigned task to Campaign Agent</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">n8n Webhook Dispatched</p>
                <p className="text-[11px] text-slate-400">Execution agent queued automated payload</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Mock Paytm API Broadcast</p>
                <p className="text-[11px] text-slate-400">Target audience segment pinged successfully</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
