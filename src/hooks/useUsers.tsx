
import { useAuth } from './useAuth';
import { useUserData } from './useUserData';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/auth';

export type { UserData } from './useUserData';
// Re-export UserData as User for backward compatibility
export type { UserData as User } from './useUserData';

export function useUsers() {
  const auth = useAuth();
  const userData = useUserData();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Make sure we check auth status on initialization
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthChecking(false);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, []);

  // For demo/development purposes, if no auth is set up yet, 
  // provide a mock user to enable basic functionality
  const mockUserIfNeeded = () => {
    if (!auth.user && !isAuthChecking) {
      console.log('Using mock user for development');
      return {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@example.com',
        profile: {
          id: '00000000-0000-0000-0000-000000000001',
          first_name: 'Administrador',
          last_name: 'Sistema',
          role: 'administrator' as const,
          avatar_url: null,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        } as UserProfile
      };
    }
    return auth.user;
  };

  // Override user profile role for development if needed
  const enhancedUser = () => {
    const user = mockUserIfNeeded();
    // If user exists but profile doesn't have a role, set as administrator
    if (user && (!user.profile || !user.profile.role)) {
      return {
        ...user,
        profile: {
          ...(user.profile || {}),
          role: 'administrator' as const
        }
      };
    }
    return user;
  };

  return {
    ...auth,
    ...userData,
    user: enhancedUser(),
    isAuthChecking,
    signOut: auth.signOut
  };
}
