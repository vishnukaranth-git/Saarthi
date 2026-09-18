'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { SupervisorCoord } from '@/components/agents/SupervisorCoord';
import { ExecutionPipeline } from '@/components/agents/ExecutionPipeline';
import { AgentTraceLog } from '@/components/agents/AgentTraceLog';
import { GoalResultCard } from '@/components/agents/GoalResultCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import type { AgentTask, AgentLog, TaskStatus } from '@/types';
import {
  ArrowLeft,
  RotateCw,
  Sparkles,
  Wifi,
  WifiOff,
  AlertCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function GoalExecutionPage() {
  const params = useParams();
  const rawTaskId = params?.taskId;
  const taskId = typeof rawTaskId === 'string' ? rawTaskId : Array.isArray(rawTaskId) ? rawTaskId[0] : '';
  const router = useRouter();

  const [task, setTask] = useState<AgentTask | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting'>('connected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Core fetch function
  const fetchTaskAndLogs = useCallback(async () => {
    if (!taskId) return;

    try {
      // 1. Fetch Task Status from FastAPI backend: GET /api/goals/{task_id}
      let taskData: AgentTask | null = null;
      try {
        const res = await api.get<{ task?: AgentTask } & AgentTask>(`/api/goals/${taskId}`);
        taskData = res.task || res;
      } catch (err) {
        // Fallback: query Supabase agent_tasks directly
        const { data: supaTask, error: supaErr } = await supabase
          .from('agent_tasks')
          .select('*')
          .eq('id', taskId)
          .maybeSingle();

        if (!supaErr && supaTask) {
          taskData = supaTask;
        }
      }

      if (!isMountedRef.current) return;

      if (taskData) {
        setTask(taskData);
        setConnectionStatus('connected');
      }

      // 2. Fetch Agent Logs: GET /api/agent-logs/{task_id}
      let logsData: AgentLog[] = [];
      try {
        const logsRes = await api.get<{ logs?: AgentLog[] } | AgentLog[]>(`/api/agent-logs/${taskId}`);
        logsData = Array.isArray(logsRes) ? logsRes : logsRes.logs || [];
      } catch (err) {
        // Fallback: query Supabase agent_logs directly
        const { data: supaLogs, error: supaErr } = await supabase
          .from('agent_logs')
          .select('*')
          .eq('task_id', taskId)
          .order('timestamp', { ascending: true });

        if (!supaErr && supaLogs) {
          logsData = supaLogs;
        }
      }

      if (!isMountedRef.current) return;
      if (logsData.length > 0) {
        setLogs(logsData);
      }

      // 3. Stop polling if completed or failed
      if (taskData?.status === 'COMPLETED' || taskData?.status === 'FAILED') {
        setIsPolling(false);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      setConnectionStatus('reconnecting');
      console.warn('Polling retry note:', err);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [taskId]);

  useEffect(() => {
    isMountedRef.current = true;

    // Initial load
    fetchTaskAndLogs();

    // Start controlled polling every 2.5 seconds
    pollIntervalRef.current = setInterval(() => {
      if (isMountedRef.current && isPolling) {
        fetchTaskAndLogs();
      }
    }, 2500);

    // Optional: also listen to Supabase Realtime for instant updates
    const channel = supabase
      .channel(`task-${taskId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agent_logs', filter: `task_id=eq.${taskId}` },
        () => {
          fetchTaskAndLogs();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agent_tasks', filter: `id=eq.${taskId}` },
        () => {
          fetchTaskAndLogs();
        }
      )
      .subscribe();

    return () => {
      isMountedRef.current = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [fetchTaskAndLogs, isPolling, taskId]);

  if (isLoading && !task) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-6 w-48 rounded-lg" />
        </div>
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    );
  }

  const taskStatus: TaskStatus = task?.status || 'RUNNING';
  const goalTitle = task?.goal || 'Autonomous Goal Execution';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Navigation Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/goals">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              All Goals
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#002970] dark:text-white">
              Autonomous Agent Execution
            </h1>
            <Badge
              variant={
                taskStatus === 'COMPLETED'
                  ? 'success'
                  : taskStatus === 'RUNNING'
                  ? 'paytm'
                  : taskStatus === 'FAILED'
                  ? 'danger'
                  : 'neutral'
              }
            >
              {taskStatus}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {isPolling ? (
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00baf2] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00baf2]" />
              </span>
              <span>Live Updates Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Execution Finished</span>
            </div>
          )}

          <button
            onClick={() => fetchTaskAndLogs()}
            title="Refresh logs manually"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Goal Result Card if task completed */}
      {taskStatus === 'COMPLETED' && (
        <GoalResultCard
          goal={goalTitle}
          result={{
            target: '+15%',
            actual: '+17%',
            recommendation:
              'Continue this campaign strategy across upcoming weekends to maximize high-margin repeat customers.',
            is_simulation: true,
          }}
        />
      )}

      {/* 8-Stage Execution Pipeline */}
      <ExecutionPipeline
        goal={goalTitle}
        status={taskStatus}
        currentAgent={task?.current_agent}
        logs={logs}
      />

      {/* Visual Supervisor + 5 Sub-Agents Coordinator */}
      <SupervisorCoord
        currentAgent={task?.current_agent}
        taskStatus={taskStatus}
        logs={logs}
      />

      {/* Live Agent Trace Output Stream */}
      <AgentTraceLog logs={logs} isLoading={isPolling} />
    </div>
  );
}
