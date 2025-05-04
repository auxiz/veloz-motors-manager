
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
        } as UserProfile);

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

  const updateProfile = async (userId: string, profileData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);

      if (error) throw error;

      await fetchAllProfiles();
      toast.success('Perfil atualizado com sucesso');
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast.error('Erro ao atualizar perfil');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('Usuário não autenticado');
      
      const userId = userData.user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
        
      // Update user profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      toast.success('Foto do perfil atualizada com sucesso');
      return { success: true, url: publicUrl.publicUrl };
    } catch (error: any) {
      console.error('Error uploading avatar:', error.message);
      toast.error('Erro ao atualizar foto de perfil');
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
        .update({ status: 'rejected' } as Partial<UserProfile>)
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
        .update({ status } as Partial<UserProfile>)
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
        .update({ role } as Partial<UserProfile>)
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
    updateUserRole,
    updateProfile,
    uploadAvatar
  };
}
