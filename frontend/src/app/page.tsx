'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMerchant } from '@/context/MerchantContext';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { session, loading } = useMerchant();

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [loading, session, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#faf8ff] dark:bg-[#080e1a]">
      <Loader2 className="h-8 w-8 animate-spin text-[#00baf2]" />
    </div>
  );
}
