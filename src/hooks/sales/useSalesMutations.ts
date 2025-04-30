
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sale } from '@/types/sales';
import { useTransactions } from '../useTransactions';
import { useVehicles } from '../useVehicles';

/**
 * Hook to handle sales mutations (add, update, delete)
 */
export const useSalesMutations = () => {
  const queryClient = useQueryClient();
  const { addTransaction } = useTransactions();
  const { updateVehicleStatus } = useVehicles();

  /**
   * Mutation to add a new sale
   */
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

      // Insert sale into database
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
          due_date: new Date().toISOString(),
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

  /**
   * Mutation to delete a sale
   */
  const deleteSale = useMutation({
    mutationFn: async (saleId: string) => {
      // First get the sale to find related transactions
      const { data: sale, error: fetchError } = await supabase
        .from('sales')
        .select('*')
        .eq('id', saleId)
        .single();

      if (fetchError) {
        console.error('Error fetching sale for deletion:', fetchError);
        toast.error('Erro ao buscar detalhes da venda');
        throw fetchError;
      }

      // Delete related financial transactions
      const { error: transactionError } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('sale_id', saleId);

      if (transactionError) {
        console.error('Error deleting related transactions:', transactionError);
        toast.error('Erro ao excluir transações financeiras relacionadas');
        throw transactionError;
      }

      // Delete the sale record
      const { error: deleteError } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId);

      if (deleteError) {
        console.error('Error deleting sale:', deleteError);
        toast.error('Erro ao excluir venda');
        throw deleteError;
      }

      toast.success('Venda excluída com sucesso');
      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    addSale,
    deleteSale,
  };
};
