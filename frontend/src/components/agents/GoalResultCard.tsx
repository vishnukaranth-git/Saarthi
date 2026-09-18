'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, ArrowUpRight, CheckCircle2, Sparkles, Megaphone } from 'lucide-react';
import Link from 'next/link';

interface GoalResultCardProps {
  goal: string;
  result?: {
    target?: string | number;
    actual?: string | number;
    recommendation?: string;
    campaign_id?: string;
    is_simulation?: boolean;
    lift_percentage?: number;
  };
}

export function GoalResultCard({ goal, result }: GoalResultCardProps) {
  const targetVal = result?.target || '+15%';
  const actualVal = result?.actual || (result?.lift_percentage ? `+${result.lift_percentage}%` : '+17%');
  const recommendation =
    result?.recommendation ||
    'Continue this campaign strategy across upcoming weekends to maximize high-margin repeat customers.';
  const isSimulation = result?.is_simulation !== false; // if simulated, show badge clearly

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-[#002970] to-[#001645] p-6 sm:p-8 text-white shadow-card">
      <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-60 w-60 rounded-full bg-[#00baf2]/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
            <Trophy className="h-3.5 w-3.5 text-emerald-400" />
            <span>GOAL ACHIEVED</span>
          </div>

          {isSimulation && (
            <span className="rounded-full bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
              Demo Simulation
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          Autonomous Campaign Executed Successfully
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-300">
          Target goal: &ldquo;{goal}&rdquo;
        </p>

        {/* Metrics comparison */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <span className="text-[11px] font-medium text-slate-300">Target</span>
            <p className="mt-1 text-2xl font-extrabold text-white">{targetVal}</p>
          </div>

          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-emerald-300">Actual Result</span>
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-1 text-2xl font-extrabold text-emerald-400">{actualVal}</p>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <span className="text-[11px] font-medium text-slate-300">Execution Mode</span>
            <p className="mt-1 text-xs font-bold text-[#2bc6ff]">Mock Paytm Gateway + n8n</p>
          </div>
        </div>

        {/* Saarthi Recommendation */}
        <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2bc6ff] mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Saarthi Recommendation</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            &ldquo;{recommendation}&rdquo;
          </p>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href="/campaigns">
            <Button variant="paytm" size="sm" rightIcon={<Megaphone className="h-4 w-4" />}>
              View Live Campaigns
            </Button>
          </Link>
          <Link href="/goals">
            <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
              Set Another Goal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
