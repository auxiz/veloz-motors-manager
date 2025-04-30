import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, AuthError, UserProfile } from '@/types/auth';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
            fetchUserProfile(currentSession.user.id);
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
        fetchUserProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Use a type cast to handle the TypeScript issue with custom RPC functions
      const { data, error } = await (supabase.rpc as any)('get_profile', { user_id: userId });

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            profile: {
              ...data,
              // Mock role for testing - this would come from the database in a real app
              role: userId === '1' ? 'administrator' : 'seller'
            } as UserProfile
          };
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signIn = async (
    email: string, 
    password: string
  ): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      console.log('Attempting login with:', email);
      
      // Remove any potential extra spaces from email and password
      const trimmedEmail = email.trim();
      const trimmedPassword = password;

      // Basic Supabase login without extra options
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful:', data);
      toast.success('Login realizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      console.error('Login catch error:', error);
      toast.error(error.message || 'Erro ao fazer login');
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string,
    captchaToken?: string
  ): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      // Removendo o captchaToken da solicitação para teste
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      toast.success('Conta criada com sucesso! Verifique seu email.');
      return { error: null };
    } catch (error: any) {
      console.error('Signup catch error:', error);
      toast.error(error.message || 'Erro ao criar conta');
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      toast.success('Logout realizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    captchaToken?: string
  ): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      
      // Removendo o captchaToken da solicitação para teste
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        captchaToken,
        redirectTo: `${window.location.origin}/configuracoes`,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      if (!user) throw new Error('User not authenticated');

      // Use a type cast to handle the TypeScript issue with custom RPC functions
      const { error } = await (supabase.rpc as any)('update_profile', { 
        user_id: user.id,
        profile_updates: updates 
      });

      if (error) throw error;

      // Refresh user profile
      await fetchUserProfile(user.id);
      toast.success('Perfil atualizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signOut: signOut || (async () => ({ error: null })),
    resetPassword,
    updateUserProfile: updateUserProfile || (async () => ({ error: null }))
  };
}
