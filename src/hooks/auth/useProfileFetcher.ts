
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserProfile } from './types';

export function useProfileFetcher() {
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Direct query to the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('Profile data retrieved:', data);
      
      if (data) {
        return data as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  return { fetchUserProfile };
}
