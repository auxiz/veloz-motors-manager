
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Customer } from '@/types/customer';

/**
 * Hook for customer data mutation operations (add, update, delete)
 */
export const useCustomerMutations = () => {
  const queryClient = useQueryClient();
  
  const addCustomer = useMutation({
    mutationFn: async (newCustomer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
      // Convert Date objects to ISO strings before sending to Supabase
      const customerToAdd = {
        ...newCustomer,
        birth_date: newCustomer.birth_date || null,
        tags: newCustomer.tags || [],
        status: newCustomer.status || 'active',
      };

      const { data, error } = await supabase
        .from('customers')
        .insert([customerToAdd])
        .select()
        .single();

      if (error) {
        console.error('Error adding customer:', error);
        toast.error('Erro ao adicionar cliente');
        throw error;
      }

      toast.success('Cliente adicionado com sucesso!');
      return data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...customer }: Customer) => {
      const { data, error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating customer:', error);
        toast.error('Erro ao atualizar cliente');
        throw error;
      }

      toast.success('Cliente atualizado com sucesso!');
      return data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting customer:', error);
        toast.error('Erro ao excluir cliente');
        throw error;
      }

      toast.success('Cliente excluído com sucesso!');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return {
    addCustomer,
    updateCustomer,
    deleteCustomer
  };
};
