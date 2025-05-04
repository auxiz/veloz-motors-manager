
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthError, AuthUser } from './types';
import { toast } from 'sonner';
import { useProfileFetcher } from './useProfileFetcher';

export function useAuthActions() {
  const [loading, setLoading] = useState<boolean>(false);
  const { fetchUserProfile } = useProfileFetcher();
  
  const signIn = async (
    email: string, 
    password: string
  ): Promise<{ error: AuthError | null; user?: AuthUser }> => {
    try {
      setLoading(true);
      console.log('Attempting login with:', email);
      
      // Remove any potential extra spaces from email and password
      const trimmedEmail = email.trim();
      const trimmedPassword = password;
      
      // Always provide detailed console logs for debugging
      console.log('Login credentials:', { email: trimmedEmail, passwordLength: trimmedPassword.length });

      // Basic Supabase login without extra options
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (error) {
        console.error('Login error:', error);
        return { error };
      }

      console.log('Login successful:', data);
      
      // Fetch user profile
      let profile = null;
      if (data.user) {
        profile = await fetchUserProfile(data.user.id);
      }
      
      const userWithProfile: AuthUser = {
        ...data.user,
        profile: profile || undefined
      };
      
      return { error: null, user: userWithProfile };
    } catch (error: any) {
      console.error('Login catch error:', error);
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
      
      // Alterando o redirectTo para a nova página de redefinição de senha
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        captchaToken,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, updates: any): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      if (!userId) throw new Error('User not authenticated');

      // Use a type cast to handle the TypeScript issue with custom RPC functions
      const { error } = await (supabase.rpc as any)('update_profile', { 
        user_id: userId,
        profile_updates: updates 
      });

      if (error) throw error;

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
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile
  };
}
