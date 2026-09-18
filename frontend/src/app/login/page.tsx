'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session) {
        router.push('/dashboard');
      } else {
        throw new Error('Could not establish an authenticated session. Please check your credentials.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please verify your credentials.';
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

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-[#111827] sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#002970] dark:text-white">
              Merchant Login
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to manage your autonomous AI business operations
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Merchant Email"
              type="email"
              placeholder="merchant@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">New to Saarthi?</span>
            <Link
              href="/signup"
              className="font-bold text-[#00baf2] hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <Lock className="h-3 w-3" />
          <span>Secured with Supabase Enterprise Authentication</span>
        </div>
      </div>
    </div>
  );
}
