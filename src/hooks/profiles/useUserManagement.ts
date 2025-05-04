
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileActionResult } from './types';
import { UserProfile } from '@/types/auth';

export function useUserManagement(onActionSuccess?: () => Promise<void>) {
  const [loading, setLoading] = useState(false);

  const deactivateUser = async (userId: string): Promise<ProfileActionResult> => {
    try {
      setLoading(true);
      
      // In a real app, you'd call an Auth Admin API to disable the user
      // Here we're just updating the profile status
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'rejected' } as Partial<UserProfile>)
        .eq('id', userId);

      if (error) throw error;

      toast.success('Usuário desativado com sucesso');
      
      if (onActionSuccess) {
        await onActionSuccess();
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deactivating user:', error.message);
      toast.error('Erro ao desativar usuário');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: 'pending' | 'approved' | 'rejected'): Promise<ProfileActionResult> => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ status } as Partial<UserProfile>)
        .eq('id', userId);

      if (error) throw error;
      
      if (onActionSuccess) {
        await onActionSuccess();
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating user status:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserRole = async (userId: string, role: string): Promise<ProfileActionResult> => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role } as Partial<UserProfile>)
        .eq('id', userId);

      if (error) throw error;
      
      if (onActionSuccess) {
        await onActionSuccess();
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating user role:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deactivateUser,
    updateUserStatus,
    updateUserRole,
    loading
  };
}
