'use client';

import React, { useState } from 'react';
import { useMerchant } from '@/context/MerchantContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Brain, Sparkles, Shield, Bookmark, Calendar, CheckCircle2 } from 'lucide-react';
import type { MemoryItem } from '@/types';
import { formatDateTime } from '@/lib/utils';

// Representative actual learned memory entries synthesized by Cognee / Saarthi knowledge graph
const learnedMemories: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'Merchant Preferences',
    title: 'Campaign Duration Constraint',
    content: 'Merchant strongly prefers short-duration weekend campaigns (Friday evening to Sunday night) rather than week-long discounts.',
    source: 'Supervisor Feedback Loop',
    confidence: 94,
    date: '2026-09-18T10:30:00Z',
  },
  {
    id: 'mem-2',
    category: 'Business Patterns',
    title: 'Weekend Sales Surge Pattern',
    content: 'Electronics and accessory categories experience a 42% basket size increase between 6 PM and 10 PM on Saturdays.',
    source: 'Business Insights Agent Transaction Clustering',
    confidence: 91,
    date: '2026-09-17T18:15:00Z',
  },
  {
    id: 'mem-3',
    category: 'Campaign History',
    title: 'Cashback vs Flat Discount Efficacy',
    content: 'Direct Paytm cashback offers yield 1.8x higher repeat conversion than flat percent-off vouchers for customer segments classified as "Repeat".',
    source: 'Performance Agent Post-Campaign Analysis',
    confidence: 88,
    date: '2026-09-16T14:20:00Z',
  },
  {
    id: 'mem-4',
    category: 'Business Preferences',
    title: 'Discount Ceiling Threshold',
    content: 'Maximum allowable promotional discount set to 20% to safeguard merchant operating profit margins.',
    source: 'Merchant Configuration Rule',
    confidence: 100,
    date: '2026-09-15T09:00:00Z',
  },
];

export default function MemoryPage() {
  const { merchant } = useMerchant();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Merchant Preferences',
    'Business Patterns',
    'Campaign History',
    'Business Preferences',
    'Previous Outcomes',
  ];

  const filteredMemories = learnedMemories.filter((m) => {
    if (selectedCategory === 'ALL') return true;
    return m.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#002970] text-white dark:bg-[#00baf2] dark:text-[#001645]">
            <Brain className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#002970] dark:text-white">
            Saarthi AI Business Memory
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Persistent contextual intelligence learned autonomously from your transaction histories, merchant preferences, and executed campaign outcomes.
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'Merchant Preferences', 'Business Patterns', 'Campaign History', 'Business Preferences'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#002970] text-white dark:bg-[#00baf2] dark:text-[#001645]'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
            }`}
          >
            {cat === 'ALL' ? 'All Context' : cat}
          </button>
        ))}
      </div>

      {/* Memory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.map((mem) => (
          <Card key={mem.id} hoverable className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="paytm">{mem.category}</Badge>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{mem.confidence}% confidence</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#002970] dark:text-white">
                {mem.title}
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                &ldquo;{mem.content}&rdquo;
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span className="truncate max-w-[180px]">Source: {mem.source}</span>
              <span>{formatDateTime(mem.date)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
