
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/auth';

export function useProfilesList() {
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

  return {
    profiles,
    loading,
    fetchAllProfiles,
  };
}
