
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { Control } from 'react-hook-form';
import { TransactionFormValues } from '../transaction-schema';

interface DueDateFieldProps {
  control: Control<TransactionFormValues>;
}

export function DueDateField({ control }: DueDateFieldProps) {
  return (
    <FormField
      control={control}
      name="due_date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Data de Vencimento</FormLabel>
          <FormControl>
            <DatePicker
              selected={field.value instanceof Date ? field.value : new Date(field.value)}
              onSelect={field.onChange}
              placeholder="Selecione a data"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
