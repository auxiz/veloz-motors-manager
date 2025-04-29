
import { useAuth } from './useAuth';
import { useUserData } from './useUserData';
import { User } from '@/types/auth';

export type { UserData } from './useUserData';

export function useUsers() {
  const auth = useAuth();
  const userData = useUserData();

  return {
    ...auth,
    ...userData,
  };
}
