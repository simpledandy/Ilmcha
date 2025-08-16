import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import i18n from '@i18n';

// Get environment variables from Expo Constants
const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and app.config.js');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signUp(email: string, password: string) {
  const language = i18n.language || 'en';
  const redirectTo = `myapp://email-confirmation?lang=${language}`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  });
  return { user: data.user, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data.user, error };
}