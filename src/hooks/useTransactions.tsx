
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid';
  sale_id?: string;
};

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*, sale:sales(*)')
        .order('due_date', { ascending: true });

      if (error) {
        toast.error('Erro ao carregar transações');
        throw error;
      }

      return data as Transaction[];
    },
  });

  const addTransaction = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id'>) => {
      // Make sure the amount is a number before sending to the database
      const transactionToAdd = {
        ...newTransaction,
        amount: Number(newTransaction.amount)
      };

      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([transactionToAdd])
        .select()
        .single();

      if (error) {
        toast.error('Erro ao adicionar transação');
        throw error;
      }

      toast.success('Transação adicionada com sucesso!');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async ({ id, ...transaction }: Transaction) => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(transaction)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast.error('Erro ao atualizar transação');
        throw error;
      }

      toast.success('Transação atualizada com sucesso!');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Erro ao excluir transação');
        throw error;
      }

      toast.success('Transação excluída com sucesso!');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  // Function to automatically create a financial transaction linked to a sale
  const createSaleTransaction = async (sale: any) => {
    const vehicleDescription = sale.vehicle ? 
      `${sale.vehicle.brand} ${sale.vehicle.model} (${sale.vehicle.year})` : 
      'Veículo';
    
    const newTransaction: Omit<Transaction, 'id'> = {
      type: 'income',
      category: 'venda',
      description: `Venda de ${vehicleDescription}`,
      amount: Number(sale.final_price),  // Ensure this is a number
      due_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      sale_id: sale.id
    };

    return addTransaction.mutate(newTransaction);
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    createSaleTransaction,
  };
};
