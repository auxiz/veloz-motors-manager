
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Customer } from '@/types/customer';

/**
 * Hook for customer data fetching operations
 */
export const useCustomerQueries = () => {
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      console.log('Fetching customers...');
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        toast.error('Erro ao carregar clientes');
        throw error;
      }

      console.log('Customers fetched:', data);
      return data as Customer[];
    },
  });

  return {
    customers,
    isLoading,
    invalidateCustomers: () => queryClient.invalidateQueries({ queryKey: ['customers'] })
  };
};
