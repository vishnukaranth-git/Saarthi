'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useMerchant } from '@/context/MerchantContext';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Users, Search, UserPlus, Phone, IndianRupee } from 'lucide-react';
import type { Customer } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function CustomersPage() {
  const { merchant } = useMerchant();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('ALL');

  const loadCustomers = useCallback(async () => {
    if (!merchant?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('merchant_id', merchant.id)
        .order('total_spend', { ascending: false });

      if (!error && data) {
        setCustomers(data);
      }
    } catch (err) {
      console.warn('Customer fetch note:', err);
    } finally {
      setIsLoading(false);
    }
  }, [merchant?.id]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm);
    const matchesSegment =
      segmentFilter === 'ALL' || c.segment?.toLowerCase() === segmentFilter.toLowerCase();
    return matchesSearch && matchesSegment;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#002970] text-white dark:bg-[#00baf2] dark:text-[#001645]">
              <Users className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#002970] dark:text-white">
              Customer Segments & Cohorts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Isolated customer intelligence profiles linked to your merchant account
          </p>
        </div>
      </div>

      {/* Search and Segment filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-[#00baf2]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'High Value', 'Repeat', 'New', 'Inactive'].map((seg) => (
            <button
              key={seg}
              onClick={() => setSegmentFilter(seg)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                segmentFilter === seg
                  ? 'bg-[#002970] text-white dark:bg-[#00baf2] dark:text-[#001645]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              {seg === 'ALL' ? 'All Customers' : seg}
            </button>
          ))}
        </div>
      </div>

      {/* Customers List Table */}
      <Card className="p-6">
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : filteredCustomers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
            <Users className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-[#002970] dark:text-white">
              No Customers Found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Customer records will appear here as orders and transactions are processed through your merchant terminal.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Customer Name</th>
                  <th className="pb-3 px-3">Contact</th>
                  <th className="pb-3 px-3">Segment</th>
                  <th className="pb-3 px-3 text-right">Purchases</th>
                  <th className="pb-3 px-3 text-right">Total Spend</th>
                  <th className="pb-3 px-3">Last Purchase</th>
                  <th className="pb-3 pr-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 pl-2 font-bold text-[#002970] dark:text-white">
                      {c.name}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono">
                      {c.phone || c.email || '—'}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          c.segment === 'High Value'
                            ? 'paytm'
                            : c.segment === 'Repeat'
                            ? 'success'
                            : c.segment === 'Inactive'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {c.segment}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right font-medium">
                      {c.purchase_count}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#002970] dark:text-[#2bc6ff]">
                      {formatCurrency(c.total_spend)}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {formatDateTime(c.last_purchase)}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          c.status === 'Active'
                            ? 'bg-emerald-500'
                            : c.status === 'Churn Risk'
                            ? 'bg-amber-500'
                            : 'bg-slate-300'
                        }`}
                        title={c.status}
                      />
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
