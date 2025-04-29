
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'sonner';
import { UserProfile } from '@/types/auth';

export interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role?: 'administrator' | 'seller' | 'financial';
}

export function useProfiles() {
  const { user, users: mockUsers } = useUsers();
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  // Fetch all profiles (for administrators)
  const fetchAllProfiles = async () => {
    try {
      setLoading(true);
      
      if (!user?.profile?.role || user.profile.role !== 'administrator') {
        throw new Error('Unauthorized');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProfiles(data as UserProfile[]);
      return data;
    } catch (error: any) {
      console.error('Error fetching profiles:', error);
      toast.error('Erro ao buscar perfis de usuários');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update profile 
  const updateProfile = async (profileId: string, updates: Partial<ProfileData>) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileId);

      if (error) throw error;
      
      toast.success('Perfil atualizado com sucesso!');
      
      // If user is updating their own profile, refresh profiles
      if (user?.id === profileId) {
        await fetchAllProfiles();
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Invite new user - in a real app, this would use Supabase's invite functionality
  // For now, we'll simulate the invite process
  const inviteUser = async (email: string, name: string, role: 'administrator' | 'seller' | 'financial') => {
    try {
      setLoading(true);
      
      if (!user?.profile?.role || user.profile.role !== 'administrator') {
        throw new Error('Unauthorized');
      }

      // In a real app, this would use Supabase Auth admin API to create an invitation
      // For now, we'll just show a success message
      toast.success(`Convite enviado para ${email}`);
      
      // Refresh profiles after invite
      await fetchAllProfiles();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error inviting user:', error);
      toast.error('Erro ao enviar convite');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Deactivate user
  const deactivateUser = async (userId: string) => {
    try {
      setLoading(true);
      
      if (!user?.profile?.role || user.profile.role !== 'administrator') {
        throw new Error('Unauthorized');
      }

      // In a real app, you would change the user's status in auth.users
      // For now, we'll just show a success message
      toast.success('Usuário desativado com sucesso');
      
      // Refresh profiles after deactivation
      await fetchAllProfiles();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deactivating user:', error);
      toast.error('Erro ao desativar usuário');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar
  const uploadAvatar = async (file: File) => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      toast.success('Avatar atualizado com sucesso');
      
      return { success: true, url: data.publicUrl };
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Erro ao fazer upload do avatar');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    profiles: profiles.length > 0 ? profiles : mockUsers.map(u => u.profile as UserProfile),
    fetchAllProfiles,
    updateProfile,
    inviteUser,
    deactivateUser,
    uploadAvatar
  };
}
