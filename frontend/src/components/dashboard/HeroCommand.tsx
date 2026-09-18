'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, TrendingUp, UserCheck, Tag, ShoppingBag, Mic, WandSparkles, CheckCircle2 } from 'lucide-react';
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
    <section className="money-flow relative overflow-hidden rounded-[28px] border border-[#bfeafb] bg-gradient-to-br from-white via-[#f4fbff] to-[#e7f7ff] p-6 shadow-card dark:border-sky-900/50 dark:from-[#101c2b] dark:via-[#0d1a29] dark:to-[#102738] sm:p-8 md:p-10">
      <div className="absolute right-[-48px] top-[-74px] h-64 w-64 rounded-full border-[18px] border-[#00baf2]/10" />
      <div className="absolute right-[9%] top-[26%] hidden h-24 w-24 rotate-12 rounded-[30px] border border-[#00baf2]/15 bg-white/40 lg:block" />

      <div className="relative z-10 max-w-4xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#a9e3fa] bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.08em] text-[#006686] shadow-sm dark:border-sky-800 dark:bg-slate-900/70 dark:text-sky-300">
          <WandSparkles className="h-3.5 w-3.5" />
          <span>Saarthi is ready</span>
        </div>

        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{greeting}, {merchantName} <span aria-hidden>👋</span></p>
        <h1 className="mt-1 text-3xl font-bold tracking-[-.04em] text-[#002970] dark:text-white sm:text-4xl md:text-[42px]">
          Move your business forward.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
          Tell Saarthi the outcome you want. Your AI teammate will investigate the numbers, launch the right move and report back.
        </p>

        {/* Large Command Input Box */}
        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8">
          <div className="relative flex flex-col items-stretch rounded-2xl border border-[#b8e8fa] bg-white p-2 shadow-[0_14px_35px_-20px_rgba(0,41,112,.45)] dark:border-sky-900 dark:bg-[#111827] sm:flex-row sm:items-center">
            <Sparkles className="absolute left-5 top-5 hidden h-4 w-4 text-[#00baf2] sm:block" />
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Example: Increase my weekend sales by 15%."
              className="w-full rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:bg-transparent dark:text-white sm:pl-10 sm:text-base"
            />
            <button type="button" aria-label="Use voice input" className="absolute bottom-[18px] right-[138px] hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#002970] sm:block dark:hover:bg-slate-800"><Mic className="h-4 w-4" /></button>
            <Button
              type="submit"
              variant="paytm"
              size="md"
              isLoading={isSubmitting}
              disabled={!goalInput.trim()}
              className="mt-2 whitespace-nowrap px-6 py-3 text-sm font-bold shadow-md sm:ml-2 sm:mt-0"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Ask Saarthi →
            </Button>
          </div>
        </form>

        {/* Quick Commands Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Try a goal:</span>
          {quickCommands.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <motion.button
                key={cmd.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleQuickCommand(cmd.query)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:border-[#9addf5] hover:bg-white hover:text-[#002970] dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
              >
                <Icon className="h-3.5 w-3.5 text-[#00a9df]" />
                <span>{cmd.label}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {['Understand', 'Analyze', 'Plan', 'Execute', 'Measure'].map((step, index) => <span key={step} className="flex items-center gap-1.5"><CheckCircle2 className={index === 0 ? 'h-3.5 w-3.5 text-emerald-500' : 'h-3.5 w-3.5 text-[#00baf2]'} />{step}</span>)}
        </div>
      </div>
    </section>
  );
}
