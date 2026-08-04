import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://demo-placeholder.supabase.co';
export const SUPABASE_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.placeholder';

export const isPlaceholderSupabase =
  !process.env.EXPO_PUBLIC_SUPABASE_URL ||
  SUPABASE_URL.includes('demo-placeholder') ||
  SUPABASE_URL.includes('placeholder');

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
