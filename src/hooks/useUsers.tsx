
import { useAuth } from './useAuth';
import { useUserData } from './useUserData';

export type { UserData } from './useUserData';
// Re-export UserData as User for backward compatibility
export type { UserData as User } from './useUserData';

export function useUsers() {
  const auth = useAuth();
  const userData = useUserData();

  return {
    ...auth,
    ...userData,
  };
}
