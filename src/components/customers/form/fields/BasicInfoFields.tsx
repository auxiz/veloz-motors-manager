
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../CustomerFormSchema';

interface BasicInfoFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
