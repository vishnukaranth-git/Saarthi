'use client';

import React from 'react';
import { Card, CardTitle } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Check, Loader2, Circle, AlertCircle } from 'lucide-react';
import type { TaskStatus, AgentLog } from '@/types';

interface ExecutionPipelineProps {
  goal: string;
  status: TaskStatus;
  currentAgent?: string;
  logs: AgentLog[];
}

const STAGES = [
  { id: 'understand', label: 'Understanding goal' },
  { id: 'analyze', label: 'Analyzing sales' },
  { id: 'opportunity', label: 'Finding opportunity' },
  { id: 'strategy', label: 'Creating strategy' },
  { id: 'campaign', label: 'Designing campaign' },
  { id: 'execute', label: 'Executing campaign' },
  { id: 'measure', label: 'Measuring result' },
  { id: 'adapt', label: 'Adapting strategy' },
];

export function ExecutionPipeline({
  goal,
  status,
  currentAgent,
  logs,
}: ExecutionPipelineProps) {
  // Determine active stage index based on logs & status
  let activeIndex = 0;

  if (status === 'COMPLETED') {
    activeIndex = STAGES.length; // all done
  } else if (status === 'PENDING') {
    activeIndex = 0;
  } else {
    // Map currentAgent or log count to current stage
    const completedAgents = new Set(logs.filter((l) => l.status === 'COMPLETED').map((l) => l.agent_name));

    if (completedAgents.has('Performance Agent')) {
      activeIndex = 7;
    } else if (completedAgents.has('Execution Agent')) {
      activeIndex = 6;
    } else if (completedAgents.has('Campaign Agent')) {
      activeIndex = 5;
    } else if (completedAgents.has('Growth Strategy Agent')) {
      activeIndex = 4;
    } else if (completedAgents.has('Business Insights Agent')) {
      activeIndex = 3;
    } else if (currentAgent) {
      if (currentAgent.toLowerCase().includes('campaign')) activeIndex = 4;
      else if (currentAgent.toLowerCase().includes('strategy')) activeIndex = 3;
      else if (currentAgent.toLowerCase().includes('insight')) activeIndex = 1;
      else activeIndex = 1;
    } else {
      activeIndex = Math.min(logs.length, 5);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00baf2]">
            {status === 'COMPLETED'
              ? 'Workflow Completed'
              : status === 'FAILED'
              ? 'Workflow Interrupted'
              : 'Saarthi is Working'}
          </span>
          <h2 className="text-lg font-bold text-[#002970] dark:text-white mt-0.5">
            &ldquo;{goal}&rdquo;
          </h2>
        </div>
        <div className="mt-2 sm:mt-0">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              status === 'COMPLETED'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : status === 'FAILED'
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                : 'bg-[#e8f7fd] text-[#006686] dark:bg-[#002970]/50 dark:text-[#2bc6ff]'
            }`}
          >
            {status === 'RUNNING' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {status}
          </span>
        </div>
      </div>

      {/* 8 Execution Stages List */}
      <div className="space-y-3">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeIndex;
          const isActive = idx === activeIndex && status === 'RUNNING';
          const isPending = idx > activeIndex;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 transition-colors ${
                isActive
                  ? 'bg-[#e8f7fd]/80 dark:bg-[#002970]/30 border border-[#00baf2]/40'
                  : isDone
                  ? 'text-slate-700 dark:text-slate-200'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              {/* Stage Icon */}
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                {isDone ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                ) : isActive ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00baf2] text-white animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </div>
                ) : status === 'FAILED' && idx === activeIndex ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white">
                    <AlertCircle className="h-3 w-3" />
                  </div>
                ) : (
                  <Circle className="h-4 w-4 text-slate-300 dark:text-slate-700" />
                )}
              </div>

              {/* Stage Label */}
              <span
                className={`text-xs md:text-sm font-semibold tracking-tight ${
                  isActive
                    ? 'text-[#002970] dark:text-[#2bc6ff] font-bold'
                    : isDone
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {stage.label}
              </span>

              {isActive && (
                <span className="ml-auto text-[10px] font-bold text-[#00baf2] uppercase tracking-wider animate-pulse">
                  In Progress
                </span>
              )}
              {isDone && (
                <span className="ml-auto text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Done
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
