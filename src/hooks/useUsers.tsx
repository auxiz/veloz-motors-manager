
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, AuthError, UserProfile } from '@/types/auth';
import { toast } from 'sonner';

export type User = {
  id: string;
  name: string;
  email: string;
  profile?: UserProfile;
};

export function useUsers() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      name: 'João Silva', 
      email: 'joao@exemplo.com',
      profile: {
        id: '1',
        first_name: 'João',
        last_name: 'Silva',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'administrator'
      }
    },
    { 
      id: '2', 
      name: 'Maria Oliveira', 
      email: 'maria@exemplo.com',
      profile: {
        id: '2',
        first_name: 'Maria',
        last_name: 'Oliveira',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'seller'
      }
    },
    { 
      id: '3', 
      name: 'Carlos Santos', 
      email: 'carlos@exemplo.com',
      profile: {
        id: '3',
        first_name: 'Carlos',
        last_name: 'Santos',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'financial'
      }
    },
    { 
      id: '4', 
      name: 'Ana Pereira', 
      email: 'ana@exemplo.com',
      profile: {
        id: '4',
        first_name: 'Ana',
        last_name: 'Pereira',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'seller'
      }
    },
    { 
      id: '5', 
      name: 'Luiz Costa', 
      email: 'luiz@exemplo.com',
      profile: {
        id: '5',
        first_name: 'Luiz',
        last_name: 'Costa',
        avatar_url: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        role: 'seller'
      }
    }
  ]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
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
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    // In a real application, we would fetch users from Supabase here
    // For now, we're using mock data

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

  const signUp = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Conta criada com sucesso! Verifique seu email.');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login realizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
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
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    users,
  };
}
