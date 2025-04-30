
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../CustomerFormSchema';

interface StatusFieldProps {
  form: UseFormReturn<CustomerFormValues>;
}

export const StatusField: React.FC<StatusFieldProps> = ({ form }) => {
  return (
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
  );
};
