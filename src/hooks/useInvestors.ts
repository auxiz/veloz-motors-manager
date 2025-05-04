
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/auth';

export type Investor = {
  id: string;
  email: string;
  profile?: UserProfile;
  name?: string;
};

export const useInvestors = () => {
  const queryClient = useQueryClient();

  // Fetch all investors
  const { data: investors = [], isLoading } = useQuery({
    queryKey: ['investors'],
    queryFn: async () => {
      // Fetch users with investor role
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('role', 'investor');

      if (error) {
        console.error('Error fetching investors:', error);
        toast.error('Erro ao carregar investidores');
        throw error;
      }

      // For each profile, get the user email from a join query
      const investorsList: Investor[] = [];
      
      for (const profile of profiles) {
        // We don't have direct access to auth.users table via the Supabase client
        // Instead, we'll simulate the email with the user's name or use a placeholder
        const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
        
        investorsList.push({
          id: profile.id,
          email: name ? `${name.toLowerCase().replace(/\s+/g, '.')}@example.com` : `investor.${profile.id.substring(0, 8)}@example.com`,
          profile: profile as UserProfile,
          name: name || `Investor ${profile.id.substring(0, 8)}`
        });
      }

      return investorsList;
    },
  });

  // Fetch vehicles that an investor has access to
  const getInvestorVehicles = async (investorId: string) => {
    const { data, error } = await supabase
      .from('vehicle_investor_access')
      .select('vehicle_id')
      .eq('user_id', investorId);

    if (error) {
      console.error('Error fetching investor vehicle access:', error);
      toast.error('Erro ao carregar acesso de veículos para investidor');
      throw error;
    }

    return data.map(item => item.vehicle_id);
  };

  // Update investor vehicle access
  const updateVehicleAccess = useMutation({
    mutationFn: async ({ 
      vehicleId, 
      investorIds 
    }: { 
      vehicleId: string; 
      investorIds: string[] 
    }) => {
      // First, delete all existing access records for this vehicle
      const { error: deleteError } = await supabase
        .from('vehicle_investor_access')
        .delete()
        .eq('vehicle_id', vehicleId);

      if (deleteError) {
        console.error('Error deleting existing investor access:', deleteError);
        toast.error('Erro ao atualizar acesso de investidores');
        throw deleteError;
      }

      // If there are no investors to add, we're done
      if (investorIds.length === 0) return { success: true };

      // Insert new access records
      const recordsToInsert = investorIds.map(investorId => ({
        vehicle_id: vehicleId,
        user_id: investorId,
      }));

      const { error: insertError } = await supabase
        .from('vehicle_investor_access')
        .insert(recordsToInsert);

      if (insertError) {
        console.error('Error adding investor access:', insertError);
        toast.error('Erro ao adicionar acesso para investidores');
        throw insertError;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-vehicles'] });
    },
  });

  return {
    investors,
    isLoading,
    getInvestorVehicles,
    updateVehicleAccess,
  };
};
