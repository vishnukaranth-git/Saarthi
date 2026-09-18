'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    // Validation
    if (!fullName.trim() || !businessName.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Supabase Auth signUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            business_name: businessName.trim(),
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const user = authData.user;
      if (!user) {
        throw new Error('User creation failed. No user was returned from authentication service.');
      }

      // Check if email confirmation is required
      if (authData.session === null && user.identities?.length === 0) {
        setErrorMessage('This email is already registered. Please sign in instead.');
        setIsLoading(false);
        return;
      }

      // 2. Link profile with authenticated user's UUID
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: fullName.trim(),
      });

      if (profileError) {
        console.warn('Profile linking note:', profileError.message);
      }

      // 3. Link merchant record with authenticated user's UUID
      const { error: merchantError } = await supabase.from('merchants').upsert({
        user_id: user.id,
        business_name: businessName.trim(),
        business_type: 'Retail',
      });

      if (merchantError) {
        console.warn('Merchant linking note:', merchantError.message);
      }

      if (!authData.session) {
        // Confirmation required
        setSuccessInfo('Account created! Check your email to confirm your account before signing in.');
      } else {
        // Logged in immediately
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during signup';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#faf8ff] p-4 dark:bg-[#080e1a]">
      <div className="w-full max-w-md">
        {/* Brand Banner */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#002970] to-[#00baf2] text-white shadow-soft">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#002970] dark:text-white">
            Paytm Saarthi AI
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Tell it your goal. Saarthi gets it done.
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-[#111827] sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#002970] dark:text-white">
              Create Merchant Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join thousands of Indian businesses powered by autonomous AI
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
              {errorMessage}
            </div>
          )}

          {successInfo ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/40 dark:bg-emerald-950/40">
              <ShieldCheck className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400 mb-2" />
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {successInfo}
              </p>
              <div className="mt-4">
                <Link href="/login">
                  <Button variant="primary" size="sm">
                    Proceed to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Rajesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                label="Business Name"
                placeholder="e.g. Kumar Electronics & Retail"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="rajesh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-type your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Create Account
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Already have a merchant account?{' '}
            <Link
              href="/login"
              className="font-bold text-[#00baf2] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
