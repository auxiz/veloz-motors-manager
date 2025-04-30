
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Customer } from '@/types/customer';

/**
 * Hook specifically for managing customer tags
 */
export const useCustomerTags = (customers: Customer[] = []) => {
  const queryClient = useQueryClient();

  const addTagToCustomer = useMutation({
    mutationFn: async ({ customerId, tag }: { customerId: string, tag: string }) => {
      const customer = customers.find(c => c.id === customerId);
      if (!customer) throw new Error('Cliente não encontrado');
      
      const updatedTags = [...(customer.tags || [])];
      if (!updatedTags.includes(tag)) {
        updatedTags.push(tag);
      }
      
      const { data, error } = await supabase
        .from('customers')
        .update({ tags: updatedTags })
        .eq('id', customerId)
        .select()
        .single();
        
      if (error) {
        console.error('Error adding tag to customer:', error);
        toast.error('Erro ao adicionar tag ao cliente');
        throw error;
      }
      
      return data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
  
  const removeTagFromCustomer = useMutation({
    mutationFn: async ({ customerId, tag }: { customerId: string, tag: string }) => {
      const customer = customers.find(c => c.id === customerId);
      if (!customer) throw new Error('Cliente não encontrado');
      
      const updatedTags = (customer.tags || []).filter(t => t !== tag);
      
      const { data, error } = await supabase
        .from('customers')
        .update({ tags: updatedTags })
        .eq('id', customerId)
        .select()
        .single();
        
      if (error) {
        console.error('Error removing tag from customer:', error);
        toast.error('Erro ao remover tag do cliente');
        throw error;
      }
      
      return data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return {
    addTagToCustomer,
    removeTagFromCustomer
  };
};
