
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/auth';

export function useProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProfiles(data as UserProfile[]);
      return data;
    } catch (error: any) {
      console.error('Error fetching profiles:', error.message);
      toast.error('Erro ao carregar perfis');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = async (email: string, name: string, role: string) => {
    try {
      setLoading(true);
      
      // In a real app, you'd call an API or function to send an invite
      // Here we're just creating a user directly with pending status
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: name }
      });

      if (userError) throw userError;

      // Create or update the profile with pending status
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.user.id,
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' '),
          role: role,
          status: 'pending',
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      toast.success('Usuário convidado com sucesso');
      await fetchAllProfiles();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error inviting user:', error.message);
      toast.error(error.message || 'Erro ao convidar usuário');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      setLoading(true);
      
      // In a real app, you'd call an Auth Admin API to disable the user
      // Here we're just updating the profile status
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'rejected' })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Usuário desativado com sucesso');
      await fetchAllProfiles();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deactivating user:', error.message);
      toast.error('Erro ao desativar usuário');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;

      await fetchAllProfiles();
      return { success: true };
    } catch (error: any) {
      console.error('Error updating user status:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserRole = async (userId: string, role: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;

      await fetchAllProfiles();
      return { success: true };
    } catch (error: any) {
      console.error('Error updating user role:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    profiles,
    loading,
    fetchAllProfiles,
    inviteUser,
    deactivateUser,
    updateUserStatus,
    updateUserRole
  };
}
