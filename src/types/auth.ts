
import { AuthUser, AuthError } from '@/hooks/auth/types';

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  updated_at?: string;
  created_at?: string;
  role?: 'administrator' | 'seller' | 'dispatcher' | 'financial' | 'investor';
  status?: 'pending' | 'approved' | 'rejected';
}

export type { AuthUser, AuthError };
