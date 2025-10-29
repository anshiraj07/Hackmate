import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Hacker {
  id: string;
  name: string;
  skills: string[];
  hackathon_experience: number;
  bio: string;
  created_at: string;
}

export interface Connection {
  id: string;
  user_id: string;
  hacker_id: string;
  status: string;
  created_at: string;
}
