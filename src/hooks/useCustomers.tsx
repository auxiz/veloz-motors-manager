
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Customer } from '@/types/customer';

export const useCustomers = () => {
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
    customers,
    isLoading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addTagToCustomer,
    removeTagFromCustomer
  };
};
