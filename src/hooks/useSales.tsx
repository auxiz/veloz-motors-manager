
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTransactions } from './useTransactions';
import { useVehicles } from './useVehicles';

export type Sale = {
  id: string;
  vehicle_id: string;
  customer_id: string;
  final_price: number;
  payment_method: string;
  seller_id: string;
  commission_amount: number;
  sale_date: string;
  vehicle?: {
    brand: string;
    model: string;
    version?: string;
    year: number;
    color: string;
    transmission: string;
    fuel: string;
  };
  customer?: {
    name: string;
    document: string;
  };
};

export const useSales = () => {
  const queryClient = useQueryClient();
  const { addTransaction } = useTransactions();
  const { updateVehicleStatus } = useVehicles();

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
      return data;
    },
  });

  const addSale = useMutation({
    mutationFn: async (newSale: Omit<Sale, 'id'>) => {
      console.log('Adding new sale:', newSale);
      
      // Validar campos obrigatórios
      if (!newSale.vehicle_id || !newSale.customer_id || !newSale.seller_id) {
        const missingFields = [];
        if (!newSale.vehicle_id) missingFields.push('vehicle_id');
        if (!newSale.customer_id) missingFields.push('customer_id');
        if (!newSale.seller_id) missingFields.push('seller_id');
        
        const errorMsg = `Campos obrigatórios faltando: ${missingFields.join(', ')}`;
        console.error(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Begin by creating the sale record
      const { data, error } = await supabase
        .from('sales')
        .insert([newSale])
        .select(`
          *,
          vehicle:vehicles(brand, model, version, year, color, transmission, fuel),
          customer:customers(name, document)
        `)
        .single();

      if (error) {
        console.error('Error adding sale:', error);
        toast.error('Erro ao registrar venda');
        throw error;
      }

      console.log('Sale added successfully:', data);

      try {
        // Create financial transaction for this sale
        await addTransaction.mutateAsync({
          type: 'income',
          category: 'venda',
          description: `Venda de veículo - ${data.vehicle?.brand} ${data.vehicle?.model} (${data.vehicle?.year})`,
          amount: data.final_price,
          due_date: new Date().toISOString(), // Ensure proper date formatting
          status: newSale.payment_method === 'cash' ? 'paid' : 'pending',
          sale_id: data.id
        });

        console.log('Transaction created for sale');

        // Update vehicle status to 'sold'
        await updateVehicleStatus.mutateAsync({
          id: newSale.vehicle_id,
          status: 'sold'
        });

        console.log('Vehicle status updated to sold');
      } catch (transactionError) {
        console.error('Error in post-sale operations:', transactionError);
        // We don't throw here as the sale itself was successfully created
      }

      toast.success('Venda registrada com sucesso!');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    sales,
    isLoading,
    addSale,
  };
};
