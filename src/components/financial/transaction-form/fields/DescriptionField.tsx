
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';
import { TransactionFormValues } from '../transaction-schema';

interface DescriptionFieldProps {
  control: Control<TransactionFormValues>;
}

export function DescriptionField({ control }: DescriptionFieldProps) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Descreva a transação" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
