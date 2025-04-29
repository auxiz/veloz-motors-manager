
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at: string;
  created_at: string;
  role?: 'administrator' | 'seller' | 'financial';
}

export interface AuthError {
  message: string;
  status?: number;
}

export type AuthUser = SupabaseUser & {
  profile?: UserProfile;
};
