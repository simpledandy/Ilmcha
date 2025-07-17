import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iafvtnoafashvcigsgfe.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZnZ0bm9hZmFzaHZjaWdzZ2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjU5MzEsImV4cCI6MjA2Njk0MTkzMX0.OunutAdM51nbMRI4nTaCcpMXPltR56S-IqJzJFPkb-s'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data.user, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data.user, error };
}