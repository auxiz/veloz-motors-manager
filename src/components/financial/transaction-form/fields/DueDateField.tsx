
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
              selected={field.value ? new Date(field.value) : new Date()}
              onSelect={(date) => {
                // If date is selected, it will be a Date object, which we need to convert to ISO string
                // This matches the schema transformation
                if (date) {
                  field.onChange(date.toISOString());
                }
              }}
              placeholder="Selecione a data"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
