
import { useAuth } from './useAuth';
import { useUserData } from './useUserData';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
        email: 'demo@example.com',
        profile: {
          id: '00000000-0000-0000-0000-000000000001',
          first_name: 'Usuário',
          last_name: 'Demonstração',
          role: 'administrator'
        }
      };
    }
    return auth.user;
  };

  return {
    ...auth,
    ...userData,
    user: mockUserIfNeeded(),
    isAuthChecking
  };
}
