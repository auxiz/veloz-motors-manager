
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
import { Customer, CUSTOMER_SEGMENTS } from '@/types/customer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckboxReactHookFormMultiple } from '@/components/ui/checkbox-multiple';

const customerSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  document: z.string().min(11, { message: 'CPF/CNPJ inválido' }),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  birth_date: z.date().optional().nullable(),
  internal_notes: z.string().optional().or(z.literal('')),
  status: z.string(),
  tags: z.array(z.string()).default([]),
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
          tags: customer.tags || [],
        });
      }
    }
  }, [customerId, isOpen, customers, form]);

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      await updateCustomer.mutateAsync({
        id: customerId,
        name: data.name,
        document: data.document,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        birth_date: data.birth_date ? data.birth_date.toISOString() : null,
        internal_notes: data.internal_notes || null,
        status: data.status,
        tags: data.tags,
        created_at: null,
        updated_at: null
      });
      onClose();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  // Group segments by type for the UI
  const behaviorSegments = CUSTOMER_SEGMENTS.filter(s => s.type === 'behavior');
  const preferenceSegments = CUSTOMER_SEGMENTS.filter(s => s.type === 'preference');

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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status do Cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-veloz-black border-veloz-gray">
                      <SelectItem value="active">Cliente Ativo</SelectItem>
                      <SelectItem value="inactive">Cliente Inativo</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segmentação do Cliente</FormLabel>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Comportamento do Cliente</h4>
                      <CheckboxReactHookFormMultiple
                        items={behaviorSegments.map(s => ({ id: s.id, label: s.label }))}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Preferências do Cliente</h4>
                      <CheckboxReactHookFormMultiple
                        items={preferenceSegments.map(s => ({ id: s.id, label: s.label }))}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  </div>
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
