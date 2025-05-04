
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileActionResult, ProfileUpdateData } from './types';

export function useProfileUpdate(onUpdateSuccess?: () => Promise<void>) {
  const [loading, setLoading] = useState(false);

  const updateProfile = async (userId: string, profileData: ProfileUpdateData): Promise<ProfileActionResult> => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);

      if (error) throw error;

      if (onUpdateSuccess) {
        await onUpdateSuccess();
      }
      
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

  const uploadAvatar = async (file: File): Promise<ProfileActionResult> => {
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
      
      if (onUpdateSuccess) {
        await onUpdateSuccess();
      }
      
      return { success: true, url: publicUrl.publicUrl };
    } catch (error: any) {
      console.error('Error uploading avatar:', error.message);
      toast.error('Erro ao atualizar foto de perfil');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    uploadAvatar,
    loading
  };
}
