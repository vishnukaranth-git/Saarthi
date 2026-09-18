'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AgentLog } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Terminal, ChevronDown, ChevronUp, Clock, Bot } from 'lucide-react';

interface AgentTraceLogProps {
  logs: AgentLog[];
  isLoading?: boolean;
}

export function AgentTraceLog({ logs, isLoading = false }: AgentTraceLogProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const renderDataPreview = (data: unknown) => {
    if (!data) return 'Waiting for agent...';
    if (typeof data === 'string') return data;
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <Card className="p-6">
      <CardHeader className="mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-[#00baf2]" />
          <CardTitle className="text-base">Autonomous Agent Trace</CardTitle>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {logs.length} events logged
        </span>
      </CardHeader>

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
          <Bot className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Waiting for agent...
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Logs from the Supervisor and specialized agents will stream here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log, idx) => {
            const isExpanded = expandedIndex === idx;
            const outputStr = renderDataPreview(log.output_data);

            return (
              <div
                key={log.id || `${log.agent_name}-${idx}`}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40 transition-all"
              >
                {/* Header item */}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="flex w-full items-center justify-between p-3.5 text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#002970] text-white dark:bg-[#00baf2] dark:text-[#001645] text-xs font-bold">
                      {log.agent_name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#002970] dark:text-white truncate">
                          {log.agent_name}
                        </span>
                        <Badge
                          size="sm"
                          variant={
                            log.status === 'COMPLETED'
                              ? 'success'
                              : log.status === 'IN_PROGRESS'
                              ? 'paytm'
                              : log.status === 'FAILED'
                              ? 'danger'
                              : 'neutral'
                          }
                        >
                          {log.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {log.action}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      {formatDateTime(log.timestamp)}
                    </span>
                    {log.execution_time_ms && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        {log.execution_time_ms}ms
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded content view */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-3.5 dark:border-slate-800 bg-white dark:bg-[#111827]">
                    {log.input_data && (
                      <div className="mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Agent Input:
                        </span>
                        <pre className="mt-1 max-h-40 overflow-auto rounded-xl bg-slate-900 p-3 text-[11px] font-mono text-emerald-400">
                          {renderDataPreview(log.input_data)}
                        </pre>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Agent Output / Reasoning:
                      </span>
                      <pre className="mt-1 max-h-60 overflow-auto rounded-xl bg-slate-900 p-3 text-[11px] font-mono text-slate-200">
                        {outputStr}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
