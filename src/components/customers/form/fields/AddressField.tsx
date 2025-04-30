
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../CustomerFormSchema';

interface AddressFieldProps {
  form: UseFormReturn<CustomerFormValues>;
}

export const AddressField: React.FC<AddressFieldProps> = ({ form }) => {
  return (
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
  );
};
