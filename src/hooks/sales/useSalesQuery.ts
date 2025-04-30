
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sale } from '@/types/sales';
import { useUsers } from '@/hooks/useUsers';

/**
 * Hook to fetch sales data from the database
 */
export const useSalesQuery = () => {
  // Access users data to provide fallback for missing seller information
  const { users } = useUsers();
  
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
            seller:profiles(first_name, last_name, id)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching sales:', error);
          toast.error('Erro ao carregar vendas');
          throw error;
        }

        console.log('Sales fetched successfully, count:', data?.length);
        
        // Transform the data to match the Sale type with robust seller handling
        return data.map((sale: any) => {
          // Try to find the user data if the seller profile is missing or incomplete
          const sellerUser = users.find(user => user.id === sale.seller_id);
          
          // Prepare a proper seller object with fallbacks at each level
          const sellerObject = {
            id: sale.seller?.id || sale.seller_id || null,
            first_name: sale.seller?.first_name || sellerUser?.name?.split(' ')[0] || 'Vendedor',
            last_name: sale.seller?.last_name || (sellerUser?.name?.split(' ').slice(1).join(' ') || '')
          };

          console.log(`Sale ID: ${sale.id}, Seller:`, sellerObject);
          
          return {
            ...sale,
            seller: sellerObject
          };
        }) as Sale[];
      } catch (err) {
        console.error('Exception in sales query:', err);
        toast.error('Erro ao carregar vendas');
        return [] as Sale[];
      }
    },
  });

  /**
   * Function to get sales by vehicle ID
   */
  const getSalesByVehicleId = async (vehicleId: string): Promise<Sale[]> => {
    try {
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
        toast.error('Erro ao buscar vendas do veículo');
        throw error;
      }

      // Use the same robust seller handling logic for consistency
      return data.map((sale: any) => {
        // Try to find the user data if the seller profile is missing
        const sellerUser = users.find(user => user.id === sale.seller_id);
        
        return {
          ...sale,
          seller: {
            id: sale.seller?.id || sale.seller_id || null,
            first_name: sale.seller?.first_name || sellerUser?.name?.split(' ')[0] || 'Vendedor',
            last_name: sale.seller?.last_name || (sellerUser?.name?.split(' ').slice(1).join(' ') || '')
          }
        };
      }) as Sale[];
    } catch (err) {
      console.error('Exception in getSalesByVehicleId:', err);
      toast.error('Erro ao buscar vendas do veículo');
      return [];
    }
  };

  return {
    sales,
    isLoading,
    error,
    getSalesByVehicleId,
  };
};
