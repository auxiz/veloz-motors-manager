
import { AuthUser, AuthError } from '@/hooks/auth/types';

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  updated_at?: string;
  created_at?: string;
  role?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export type { AuthUser, AuthError };
