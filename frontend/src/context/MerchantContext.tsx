'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Merchant, Profile } from '@/types';

interface MerchantContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  merchant: Merchant | null;
  loading: boolean;
  error: string | null;
  refreshMerchant: () => Promise<void>;
  signOut: () => Promise<void>;
}

const MerchantContext = createContext<MerchantContextType>({
  user: null,
  session: null,
  profile: null,
  merchant: null,
  loading: true,
  error: null,
  refreshMerchant: async () => {},
  signOut: async () => {},
});

export function MerchantProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMerchantAndProfile = useCallback(async (userId: string) => {
    try {
      setError(null);

      // 1. Fetch Profile
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr) {
        console.warn('Profile fetch note:', profileErr.message);
      }
      setProfile(profileData || null);

      // 2. Fetch Merchant for this authenticated user_id
      const { data: merchantData, error: merchantErr } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (merchantErr) {
        console.warn('Merchant fetch note:', merchantErr.message);
      }

      if (merchantData) {
        setMerchant(merchantData);
      } else {
        // If merchant doesn't exist yet, check fallback or keep null
        setMerchant(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load merchant profile';
      setError(msg);
    }
  }, []);

  const refreshMerchant = useCallback(async () => {
    if (user?.id) {
      await loadMerchantAndProfile(user.id);
    }
  }, [user?.id, loadMerchantAndProfile]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          await loadMerchantAndProfile(initialSession.user.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Auth initialization failed');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          setLoading(true);
          await loadMerchantAndProfile(currentSession.user.id);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setProfile(null);
          setMerchant(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadMerchantAndProfile]);

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setMerchant(null);
      setLoading(false);
    }
  };

  return (
    <MerchantContext.Provider
      value={{
        user,
        session,
        profile,
        merchant,
        loading,
        error,
        refreshMerchant,
        signOut,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
}

export function useMerchant() {
  return useContext(MerchantContext);
}
