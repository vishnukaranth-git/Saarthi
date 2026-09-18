'use client';

import React, { useState, useEffect } from 'react';
import { useMerchant } from '@/context/MerchantContext';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Settings, User, Store, Shield, Bell, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { merchant, profile, refreshMerchant } = useMerchant();

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Retail');
  const [city, setCity] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('20');
  const [preferredLanguage, setPreferredLanguage] = useState('Hindi & English');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
    if (merchant?.business_name) setBusinessName(merchant.business_name);
    if (merchant?.business_type) setBusinessType(merchant.business_type);
    if (merchant?.city) setCity(merchant.city);
  }, [profile, merchant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      if (profile?.id) {
        await supabase
          .from('profiles')
          .update({ full_name: fullName.trim() })
          .eq('id', profile.id);
      }

      if (merchant?.id) {
        await supabase
          .from('merchants')
          .update({
            business_name: businessName.trim(),
            business_type: businessType,
            city: city.trim(),
          })
          .eq('id', merchant.id);
      }

      await refreshMerchant();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update settings';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#002970] text-white dark:bg-[#00baf2] dark:text-[#001645]">
            <Settings className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#002970] dark:text-white">
            Merchant Settings & Profile
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Configure merchant profile credentials, business parameters, and AI autonomous guidelines
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          <span>Settings saved and updated successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#00baf2]" />
              <CardTitle className="text-base">Merchant Profile</CardTitle>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              value={profile?.email || ''}
              disabled
              helperText="Email is verified with Supabase Auth"
            />
          </div>
        </Card>

        {/* Business Information Card */}
        <Card className="p-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-[#00baf2]" />
              <CardTitle className="text-base">Business Information</CardTitle>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Registered Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                Business Type
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100 focus:outline-none focus:border-[#00baf2]"
              >
                <option value="Retail">Retail Store</option>
                <option value="Grocery">Kirana & Grocery</option>
                <option value="Electronics">Consumer Electronics</option>
                <option value="Food">Restaurant / Cafe</option>
                <option value="Services">Professional Services</option>
              </select>
            </div>
            <Input
              label="Operating City"
              placeholder="e.g. Bengaluru, Karnataka"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              label="Merchant ID (UUID)"
              value={merchant?.id || 'Allocated upon registration'}
              disabled
            />
          </div>
        </Card>

        {/* Campaign Preferences */}
        <Card className="p-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#00baf2]" />
              <CardTitle className="text-base">Autonomous AI Safety Guardrails</CardTitle>
            </div>
            <CardDescription>
              Hard limits respected by the Growth Strategy and Campaign Agents
            </CardDescription>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Maximum Promotional Discount (%)"
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              helperText="Agent will never generate offers exceeding this margin limit"
            />
            <Input
              label="Primary Campaign Language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              helperText="Sarvam AI localization default target"
            />
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="paytm" size="md" isLoading={isSaving}>
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
