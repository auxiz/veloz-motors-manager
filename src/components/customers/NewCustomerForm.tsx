
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCustomers } from '@/hooks/useCustomers';
import { toast } from 'sonner';

const customerSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  document: z.string().min(11, { message: 'CPF/CNPJ inválido' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  birth_date: z.date().optional().nullable(),
  internal_notes: z.string().optional().or(z.literal('')),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface NewCustomerFormProps {
  onCustomerCreated?: (customerId: string) => void;
  embedded?: boolean;
}

export const NewCustomerForm: React.FC<NewCustomerFormProps> = ({ onCustomerCreated, embedded = false }) => {
  const { addCustomer } = useCustomers();
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      document: '',
      phone: '',
      email: '',
      address: '',
      birth_date: null,
      internal_notes: '',
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      const result = await addCustomer.mutateAsync({
        ...data,
        status: 'active',
        tags: [],
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        internal_notes: data.internal_notes || null,
      });

      if (result && onCustomerCreated) {
        onCustomerCreated(result.id);
        if (!embedded) {
          form.reset();
        }
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Erro ao criar cliente');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF/CNPJ</FormLabel>
              <FormControl>
                <Input placeholder="CPF ou CNPJ do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="Telefone do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Endereço do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-veloz-yellow hover:bg-yellow-500 text-black font-semibold"
            disabled={addCustomer.isPending}
          >
            {addCustomer.isPending ? 'Salvando...' : 'Salvar Cliente'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
