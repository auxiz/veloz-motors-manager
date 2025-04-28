
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Sale = {
  id: string;
  vehicle_id: string;
  customer_id: string;
  final_price: number;
  payment_method: string;
  seller_id: string;
  commission_amount: number;
  sale_date: string;
};

export const useSales = () => {
  const queryClient = useQueryClient();

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          vehicle:vehicles(brand, model, version, year),
          customer:customers(name, document)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Erro ao carregar vendas');
        throw error;
      }

      return data;
    },
  });

  const addSale = useMutation({
    mutationFn: async (newSale: Omit<Sale, 'id'>) => {
      const { data, error } = await supabase
        .from('sales')
        .insert([newSale])
        .select()
        .single();

      if (error) {
        toast.error('Erro ao adicionar venda');
        throw error;
      }

      // Update vehicle status
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .update({ status: 'sold' })
        .eq('id', newSale.vehicle_id);

      if (vehicleError) {
        toast.error('Erro ao atualizar status do veículo');
        throw vehicleError;
      }

      toast.success('Venda registrada com sucesso!');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  return {
    sales,
    isLoading,
    addSale,
  };
};
