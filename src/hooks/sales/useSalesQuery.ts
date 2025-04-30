
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sale } from '@/types/sales';

/**
 * Hook to fetch sales data from the database
 */
export const useSalesQuery = () => {
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

        console.log('Sales fetched:', data);
        
        // Transform the data to match the Sale type
        return data.map((sale: any) => ({
          ...sale,
          // Ensure seller has the correct structure to match the Sale type
          seller: sale.seller ? {
            id: sale.seller.id || sale.seller_id,
            first_name: sale.seller.first_name,
            last_name: sale.seller.last_name
          } : null
        })) as Sale[];
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

      // Transform the data to match the Sale type
      return data.map((sale: any) => ({
        ...sale,
        seller: sale.seller ? {
          id: sale.seller.id || sale.seller_id,
          first_name: sale.seller.first_name,
          last_name: sale.seller.last_name
        } : null
      })) as Sale[];
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
