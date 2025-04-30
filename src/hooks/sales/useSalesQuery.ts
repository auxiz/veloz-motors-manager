
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sale } from '@/types/sales';
import { useUsers } from '@/hooks/useUsers';

/**
 * Enhanced hook to fetch sales data with robust seller information handling
 */
export const useSalesQuery = () => {
  // Access users data to provide fallback for missing seller information
  const { users } = useUsers();
  const queryClient = useQueryClient();
  
  const { data: sales = [], isLoading, error } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      console.log('Fetching sales...');
      try {
        const { data, error } = await supabase
          .from('sales')
          .select(`
            *,
            vehicle:vehicles(brand, model, version, year, color, transmission, fuel),
            customer:customers(name, document),
            seller:profiles(first_name, last_name, id, avatar_url)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching sales:', error);
          toast.error('Erro ao carregar vendas: ' + error.message);
          throw error;
        }

        console.log('Sales fetched successfully, count:', data?.length);
        
        // Transform the data to match the Sale type with enhanced seller handling
        return data.map((sale: any) => {
          // Try to find the user data if the seller profile is missing or incomplete
          const sellerUser = users.find(user => user.id === sale.seller_id);
          
          // Prepare a proper seller object with comprehensive fallbacks
          const sellerObject = {
            id: sale.seller?.id || sale.seller_id || null,
            first_name: sale.seller?.first_name || 
                       (sellerUser?.profile?.first_name) || 
                       (sellerUser?.name?.split(' ')[0]) || 
                       'Vendedor',
            last_name: sale.seller?.last_name || 
                      (sellerUser?.profile?.last_name) || 
                      (sellerUser?.name?.split(' ').slice(1).join(' ')) || 
                      ''
          };

          return {
            ...sale,
            seller: sellerObject
          };
        }) as Sale[];
      } catch (err: any) {
        console.error('Exception in sales query:', err);
        toast.error('Erro ao carregar vendas: ' + (err.message || 'Erro desconhecido'));
        return [] as Sale[];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  /**
   * Enhanced function to get sales by vehicle ID with better seller handling
   */
  const getSalesByVehicleId = async (vehicleId: string): Promise<Sale[]> => {
    try {
      console.log(`Fetching sales for vehicle ID: ${vehicleId}`);
      
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          vehicle:vehicles(brand, model, version, year, color, transmission, fuel),
          customer:customers(name, document),
          seller:profiles(first_name, last_name, id)
        `)
        .eq('vehicle_id', vehicleId);

      if (error) {
        console.error('Error fetching sales by vehicle ID:', error);
        toast.error('Erro ao buscar vendas do veículo: ' + error.message);
        throw error;
      }

      console.log(`Found ${data.length} sales for vehicle ${vehicleId}`);

      // Use the same comprehensive seller handling logic for consistency
      return data.map((sale: any) => {
        // Try to find the user data if the seller profile is missing
        const sellerUser = users.find(user => user.id === sale.seller_id);
        
        return {
          ...sale,
          seller: {
            id: sale.seller?.id || sale.seller_id || null,
            first_name: sale.seller?.first_name || 
                      (sellerUser?.profile?.first_name) || 
                      (sellerUser?.name?.split(' ')[0]) || 
                      'Vendedor',
            last_name: sale.seller?.last_name || 
                      (sellerUser?.profile?.last_name) || 
                      (sellerUser?.name?.split(' ').slice(1).join(' ')) || 
                      ''
          }
        };
      }) as Sale[];
    } catch (err: any) {
      console.error('Exception in getSalesByVehicleId:', err);
      toast.error('Erro ao buscar vendas do veículo: ' + (err.message || 'Erro desconhecido'));
      return [];
    }
  };

  /**
   * Manually invalidate the sales cache if needed
   */
  const refreshSales = () => {
    queryClient.invalidateQueries({ queryKey: ['sales'] });
  };

  return {
    sales,
    isLoading,
    error,
    getSalesByVehicleId,
    refreshSales,
  };
};
