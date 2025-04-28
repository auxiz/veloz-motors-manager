
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCustomers } from '@/hooks/useCustomers';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';

const customerSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  document: z.string().min(11, { message: 'CPF/CNPJ inválido' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  birth_date: z.date().optional().nullable(),
  internal_notes: z.string().optional().or(z.literal('')),
  status: z.string(),
  tags: z.array(z.string()).nullable(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface EditCustomerDialogProps {
  customerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCustomerDialog: React.FC<EditCustomerDialogProps> = ({ 
  customerId, 
  isOpen, 
  onClose 
}) => {
  const { customers, updateCustomer } = useCustomers();
  
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
      status: 'active',
      tags: [],
    },
  });

  useEffect(() => {
    if (isOpen && customerId) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        form.reset({
          name: customer.name,
          document: customer.document,
          phone: customer.phone || '',
          email: customer.email || '',
          address: customer.address || '',
          birth_date: customer.birth_date ? new Date(customer.birth_date) : null,
          internal_notes: customer.internal_notes || '',
          status: customer.status,
          tags: customer.tags,
        });
      }
    }
  }, [customerId, isOpen, customers, form]);

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      await updateCustomer.mutateAsync({
        id: customerId,
        ...data,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        internal_notes: data.internal_notes || null,
      });
      onClose();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-veloz-black text-veloz-white border-veloz-gray max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar Cliente</DialogTitle>
        </DialogHeader>
        
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Input placeholder="Endereço completo do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Nascimento</FormLabel>
                  <DatePicker 
                    selected={field.value} 
                    onSelect={field.onChange} 
                    placeholder="Selecione a data" 
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="internal_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anotações Internas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações importantes, preferências, etc." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={onClose}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-veloz-yellow hover:bg-yellow-500 text-black"
                disabled={updateCustomer.isPending}
              >
                {updateCustomer.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
