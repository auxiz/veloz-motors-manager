
import { useAuth } from './useAuth';
import { useUserData } from './useUserData';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile, AuthUser } from '@/types/auth';

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
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        profile: {
          id: '00000000-0000-0000-0000-000000000001',
          first_name: 'Administrador',
          last_name: 'Sistema',
          role: 'administrator' as const,
          status: 'approved' as const,
          avatar_url: null,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        } as UserProfile
      } as AuthUser;
    }
    return auth.user;
  };

  // Override user profile role for development if needed
  const enhancedUser = () => {
    const user = mockUserIfNeeded();
    
    // Log for debugging
    console.log("Auth user details:", user?.email, "Role:", user?.profile?.role, "Status:", user?.profile?.status);
    
    // Special handling for auxizpro@gmail.com - ensure they are always an administrator
    if (user?.email === 'auxizpro@gmail.com') {
      console.log("Ensuring admin privileges for auxizpro@gmail.com");
      return {
        ...user,
        profile: {
          ...(user?.profile || {}),
          role: 'administrator' as const,
          status: 'approved' as const
        }
      } as AuthUser;
    }
    
    // If user exists but profile doesn't have a role, set as administrator
    if (user && (!user.profile || !user.profile.role)) {
      return {
        ...user,
        profile: {
          ...(user.profile || {}),
          role: 'administrator' as const,
          status: 'approved' as const
        }
      } as AuthUser;
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
