'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, TrendingUp, UserCheck, Tag, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroCommandProps {
  merchantName: string;
}

const quickCommands = [
  { label: 'Increase weekend sales', icon: TrendingUp, query: 'Increase my weekend sales by 15%' },
  { label: 'Bring back inactive customers', icon: UserCheck, query: 'Bring back inactive customers with a personalized cashback offer' },
  { label: 'Promote a new product', icon: Tag, query: 'Launch a campaign to promote our new arrivals to repeat customers' },
  { label: 'Clear slow-moving inventory', icon: ShoppingBag, query: 'Clear slow-moving inventory with a limited-time 20% discount' },
];

export function HeroCommand({ merchantName }: HeroCommandProps) {
  const router = useRouter();
  const [goalInput, setGoalInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    setIsSubmitting(true);
    router.push(`/goals?prompt=${encodeURIComponent(goalInput.trim())}`);
  };

  const handleQuickCommand = (query: string) => {
    setGoalInput(query);
    router.push(`/goals?prompt=${encodeURIComponent(query)}`);
  };

  // Determine greeting based on current local time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001645] via-[#002970] to-[#001d52] p-6 sm:p-8 md:p-10 text-white shadow-card">
      {/* Subtle background glow effect */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#00baf2]/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[#2bc6ff]/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-[#2bc6ff] backdrop-blur-sm mb-4">
          <Sparkles className="h-3.5 w-3.5 text-[#00baf2]" />
          <span>Autonomous AI Business Teammate</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          {greeting}, <span className="text-[#2bc6ff]">{merchantName}</span>
        </h1>

        <p className="mt-2 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          Tell Saarthi what you want to achieve. We&apos;ll analyze, plan, execute, and measure.
        </p>

        {/* Large Command Input Box */}
        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl bg-white p-2 shadow-xl dark:bg-[#111827] border border-white/20">
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Example: Increase my weekend sales by 15%."
              className="w-full px-4 py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:bg-transparent rounded-xl"
            />
            <Button
              type="submit"
              variant="paytm"
              size="md"
              isLoading={isSubmitting}
              disabled={!goalInput.trim()}
              className="mt-2 sm:mt-0 sm:ml-2 whitespace-nowrap px-6 py-3 text-sm font-bold shadow-md hover:shadow-glow"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Ask Saarthi →
            </Button>
          </div>
        </form>

        {/* Quick Commands Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-300 mr-1">Quick Goals:</span>
          {quickCommands.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <motion.button
                key={cmd.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleQuickCommand(cmd.query)}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5 text-[#2bc6ff]" />
                <span>{cmd.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
