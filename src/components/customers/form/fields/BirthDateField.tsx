
import React from 'react';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../CustomerFormSchema';

interface BirthDateFieldProps {
  form: UseFormReturn<CustomerFormValues>;
}

export const BirthDateField: React.FC<BirthDateFieldProps> = ({ form }) => {
  return (
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
  );
};
