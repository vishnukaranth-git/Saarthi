import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zlhebtsfkfgyqeofadgy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsaGVidHNma2ZneXFlb2ZhZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MzM0MzksImV4cCI6MjEwNTMwOTQzOX0.eFiJJ_z-2lBk-sCp9t5TZHQMAQL1e5gcaO8xnZiX2h4';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
