'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMerchant } from '@/context/MerchantContext';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Target, Sparkles, ArrowRight, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import type { AgentTask } from '@/types';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

function GoalsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { merchant, profile } = useMerchant();

  const [goalText, setGoalText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isColdStart, setIsColdStart] = useState(false);

  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Pre-fill prompt if passed from dashboard search or hero
  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setGoalText(promptParam);
    }
  }, [searchParams]);

  // Load existing tasks
  useEffect(() => {
    async function loadTasks() {
      if (!merchant?.id) {
        setLoadingTasks(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('agent_tasks')
          .select('*')
          .eq('merchant_id', merchant.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setTasks(data);
        }
      } catch (err) {
        console.warn('Task load note:', err);
      } finally {
        setLoadingTasks(false);
      }
    }

    loadTasks();
  }, [merchant?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setIsColdStart(false);

    try {
      // POST /api/goals with { goal, merchant_id }
      const payload: { goal: string; merchant_id?: string } = {
        goal: goalText.trim(),
      };
      if (merchant?.id) {
        payload.merchant_id = merchant.id;
      }

      const response = await api.post<{ task_id?: string; id?: string; task?: { id: string } }>(
        '/api/goals',
        payload
      );

      const taskId = response.task_id || response.id || response.task?.id;

      if (!taskId) {
        throw new Error('Server did not return a valid task ID. Please try again.');
      }

      // Redirect directly to execution page
      router.push(`/goals/${taskId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to launch goal execution';
      setErrorMessage(msg);
      if (msg.includes('timed out') || msg.includes('waking up')) {
        setIsColdStart(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#002970] text-white dark:bg-[#00baf2] dark:text-[#001645]">
            <Target className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#002970] dark:text-white">
            Set Autonomous Business Goal
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          State your business target in natural language. Saarthi coordinates multi-agent reasoning, strategy synthesis, and campaign dispatch.
        </p>
      </div>

      {isColdStart && (
        <div className="rounded-2xl border border-[#00baf2]/30 bg-[#e8f7fd] p-4 text-xs text-[#006686] dark:bg-[#002970]/40 dark:text-[#2bc6ff]">
          <p className="font-bold flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#00baf2] animate-spin" />
            Saarthi backend is waking up on Render...
          </p>
          <p className="mt-1">
            Free Render instances sleep after inactivity. This first request might take 20-30 seconds to spin up.
          </p>
        </div>
      )}

      {errorMessage && !isColdStart && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Goal Creator Card */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-bold text-[#002970] dark:text-white">
            What is your business goal?
          </label>
          <textarea
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            rows={3}
            placeholder="e.g. Increase my weekend sales by 15% with a cashback campaign for repeat customers."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#00baf2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00baf2]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-900/80 resize-none transition-colors"
            required
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-medium py-1">Suggestions:</span>
              {[
                'Increase weekend sales by 15%',
                'Re-engage churned customers',
                'Promote high-margin inventory',
              ].map((sugg) => (
                <button
                  key={sugg}
                  type="button"
                  onClick={() => setGoalText(sugg)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:bg-slate-50 hover:text-[#002970] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                >
                  {sugg}
                </button>
              ))}
            </div>

            <Button
              type="submit"
              variant="paytm"
              size="md"
              isLoading={isSubmitting}
              disabled={!goalText.trim()}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Ask Saarthi →
            </Button>
          </div>
        </form>
      </Card>

      {/* Goal History Table */}
      <Card className="p-6">
        <CardHeader>
          <div>
            <CardTitle>Autonomous Goal Execution History</CardTitle>
            <CardDescription>
              Past goals processed by Saarthi Supervisor and specialized agents
            </CardDescription>
          </div>
        </CardHeader>

        {loadingTasks ? (
          <TableSkeleton rows={4} />
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
            <Clock className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No historical tasks
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Submit your first goal above to launch the autonomous agent team.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Goal</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Agent</th>
                  <th className="pb-3 px-3">Created</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 pl-2 font-bold text-[#002970] dark:text-white max-w-xs truncate">
                      {task.goal}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          task.status === 'COMPLETED'
                            ? 'success'
                            : task.status === 'RUNNING'
                            ? 'paytm'
                            : task.status === 'FAILED'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {task.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {task.current_agent || 'Supervisor'}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {formatDateTime(task.created_at)}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <Link href={`/goals/${task.id}`}>
                        <Button variant="outline" size="sm">
                          Live Trace →
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

export default function GoalsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <TableSkeleton rows={3} />
        </div>
      }
    >
      <GoalsContent />
    </Suspense>
  );
}
