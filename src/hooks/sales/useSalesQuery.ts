
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sale } from '@/types/sales';

/**
 * Hook to fetch sales data from the database
 */
export const useSalesQuery = () => {
  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      console.log('Fetching sales...');
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          vehicle:vehicles(brand, model, version, year, color, transmission, fuel),
          customer:customers(name, document)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sales:', error);
        toast.error('Erro ao carregar vendas');
        throw error;
      }

      console.log('Sales fetched:', data);
      return data as Sale[];
    },
  });

  /**
   * Function to get sales by vehicle ID
   */
  const getSalesByVehicleId = async (vehicleId: string): Promise<Sale[]> => {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('vehicle_id', vehicleId);

    if (error) {
      console.error('Error fetching sales by vehicle ID:', error);
      toast.error('Erro ao buscar vendas do veículo');
      throw error;
    }

    return data || [];
  };

  return {
    sales,
    isLoading,
    getSalesByVehicleId,
  };
};
