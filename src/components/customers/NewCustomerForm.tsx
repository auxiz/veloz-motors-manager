
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { useCustomers } from '@/hooks/useCustomers';
import { toast } from 'sonner';
import { Customer } from '@/types/customer';
import { customerSchema, CustomerFormValues } from './form/CustomerFormSchema';
import { BasicInfoFields } from './form/fields/BasicInfoFields';
import { ContactFields } from './form/fields/ContactFields';
import { AddressField } from './form/fields/AddressField';
import { BirthDateField } from './form/fields/BirthDateField';
import { StatusField } from './form/fields/StatusField';
import { TagsField } from './form/fields/TagsField';
import { NotesField } from './form/fields/NotesField';
import { SubmitButton } from './form/SubmitButton';

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
      status: 'active',
      tags: [],
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      // Create the customer object to match the required type
      const newCustomer: Omit<Customer, 'id' | 'created_at' | 'updated_at'> = {
        name: data.name,
        document: data.document,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        birth_date: data.birth_date ? data.birth_date.toISOString() : null,
        internal_notes: data.internal_notes || null,
        status: data.status,
        tags: data.tags,
      };
      
      const result = await addCustomer.mutateAsync(newCustomer);

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
        <BasicInfoFields form={form} />
        <ContactFields form={form} />
        <AddressField form={form} />
        <BirthDateField form={form} />
        <StatusField form={form} />
        <TagsField form={form} />
        <NotesField form={form} />
        <SubmitButton isSubmitting={addCustomer.isPending} />
      </form>
    </Form>
  );
};
