
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserProfile } from './types';

export function useProfileFetcher() {
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      // Use a type cast to handle the TypeScript issue with custom RPC functions
      const { data, error } = await (supabase.rpc as any)('get_profile', { user_id: userId });

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (data) {
        return {
          ...data,
          // Mock role for testing - this would come from the database in a real app
          role: userId === '1' ? 'administrator' : 'seller'
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  return { fetchUserProfile };
}
