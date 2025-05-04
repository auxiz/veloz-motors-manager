
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InviteUserResult } from './types';
import { UserProfile } from '@/types/auth';

export function useInviteUser(onInviteSuccess?: () => Promise<void>) {
  const [loading, setLoading] = useState(false);

  const inviteUser = async (email: string, name: string, role: string): Promise<InviteUserResult> => {
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
      
      if (onInviteSuccess) {
        await onInviteSuccess();
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error inviting user:', error.message);
      toast.error(error.message || 'Erro ao convidar usuário');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    inviteUser,
    loading
  };
}
