
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Transaction = {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  sale_id?: string;
};

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
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
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([newTransaction])
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

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
  };
};
