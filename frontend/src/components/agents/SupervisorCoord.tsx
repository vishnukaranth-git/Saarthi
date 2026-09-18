'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import {
  Brain,
  LineChart,
  Target,
  Megaphone,
  Zap,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  LucideIcon,
} from 'lucide-react';
import { AgentLog } from '@/types';

interface SupervisorCoordProps {
  currentAgent?: string;
  taskStatus: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  logs: AgentLog[];
}

interface AgentDef {
  name: string;
  displayName: string;
  role: string;
  icon: LucideIcon;
  color: string;
}

const specializedAgents: AgentDef[] = [
  {
    name: 'Business Insights Agent',
    displayName: 'Insights Agent',
    role: 'Analyzes transactions & sales patterns',
    icon: LineChart,
    color: 'border-cyan-400 text-cyan-600 dark:text-cyan-400',
  },
  {
    name: 'Growth Strategy Agent',
    displayName: 'Strategy Agent',
    role: 'Synthesizes targeted business plays',
    icon: Target,
    color: 'border-blue-500 text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Campaign Agent',
    displayName: 'Campaign Agent',
    role: 'Generates localized multi-lingual copy & offers',
    icon: Megaphone,
    color: 'border-indigo-500 text-indigo-600 dark:text-indigo-400',
  },
  {
    name: 'Execution Agent',
    displayName: 'Execution Agent',
    role: 'Dispatches via n8n & Paytm mock gateway',
    icon: Zap,
    color: 'border-amber-500 text-amber-600 dark:text-amber-400',
  },
  {
    name: 'Performance Agent',
    displayName: 'Performance Agent',
    role: 'Measures uplift & stores feedback in memory',
    icon: TrendingUp,
    color: 'border-emerald-500 text-emerald-600 dark:text-emerald-400',
  },
];

export function SupervisorCoord({
  currentAgent,
  taskStatus,
  logs,
}: SupervisorCoordProps) {
  // Check which agents have completed logs
  const completedAgentNames = new Set(
    logs.filter((l) => l.status === 'COMPLETED').map((l) => l.agent_name)
  );

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-b from-white to-slate-50/50 dark:from-[#111827] dark:to-[#0b0f19]">
      {/* Supervisor Top Coordinator */}
      <div className="flex flex-col items-center text-center">
        <motion.div
          animate={
            taskStatus === 'RUNNING'
              ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 3 } }
              : {}
          }
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#002970] to-[#00baf2] text-white shadow-soft"
        >
          <Brain className="h-8 w-8 text-white" />
          {taskStatus === 'RUNNING' && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00baf2] opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00baf2]" />
            </span>
          )}
        </motion.div>

        <h3 className="mt-3 text-lg font-extrabold tracking-tight text-[#002970] dark:text-white">
          SUPERVISOR AGENT
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
          Coordinating Saarthi&apos;s autonomous workflow across specialized agents
        </p>

        {/* Central visual line down to sub-agents */}
        <div className="my-4 h-6 w-0.5 bg-gradient-to-b from-[#00baf2] to-slate-300 dark:to-slate-700" />
      </div>

      {/* 5 Connected Specialized Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        {specializedAgents.map((agent) => {
          const Icon = agent.icon;
          const isDone =
            completedAgentNames.has(agent.name) ||
            taskStatus === 'COMPLETED';
          const isActive =
            taskStatus === 'RUNNING' &&
            (currentAgent?.toLowerCase().includes(agent.displayName.toLowerCase()) ||
              currentAgent?.toLowerCase().includes(agent.name.toLowerCase()));

          return (
            <div
              key={agent.name}
              className={`relative rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? 'border-[#00baf2] bg-[#e8f7fd]/80 shadow-soft ring-2 ring-[#00baf2]/30 dark:bg-[#002970]/30 dark:border-[#00baf2]'
                  : isDone
                  ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-800/30 dark:bg-emerald-950/20'
                  : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-[#111827]/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 ${
                      isActive ? 'text-[#00baf2] bg-white dark:bg-slate-900' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : isActive ? (
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00baf2] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00baf2]" />
                    </span>
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                  )}
                </div>

                <h4 className="text-xs font-bold text-[#002970] dark:text-white line-clamp-1">
                  {agent.displayName}
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {agent.role}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-semibold">
                {isDone ? (
                  <span className="text-emerald-600 dark:text-emerald-400">Completed</span>
                ) : isActive ? (
                  <span className="text-[#00baf2] animate-pulse">Active & Reasoning...</span>
                ) : (
                  <span className="text-slate-400">Waiting</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
