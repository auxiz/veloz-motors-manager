
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from './auth/types';
import { useProfileFetcher } from './auth/useProfileFetcher';
import { useAuthActions } from './auth/useAuthActions';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { fetchUserProfile } = useProfileFetcher();
  const authActions = useAuthActions();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch user profile using setTimeout to prevent Supabase deadlocks
        if (currentSession?.user) {
          setTimeout(() => {
            updateUserWithProfile(currentSession.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Got existing session:', currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        updateUserWithProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUserWithProfile = async (userId: string) => {
    const profile = await fetchUserProfile(userId);
    console.log('Fetched user profile:', profile);
    
    if (profile) {
      setUser((prevUser) => {
        if (!prevUser) return null;
        console.log('Updating user with profile. Role:', profile.role, 'Status:', profile.status);
        return {
          ...prevUser,
          profile
        };
      });
    }
  };

  const updateUserProfile = async (updates: any) => {
    if (!user) return { error: { message: 'User not authenticated' } };
    
    const result = await authActions.updateUserProfile(user.id, updates);
    
    if (!result.error) {
      // Refresh user profile after update
      await updateUserWithProfile(user.id);
    }
    
    return result;
  };

  return {
    user,
    session,
    loading: loading || authActions.loading,
    signIn: authActions.signIn,
    signOut: authActions.signOut,
    resetPassword: authActions.resetPassword,
    updateUserProfile
  };
}
