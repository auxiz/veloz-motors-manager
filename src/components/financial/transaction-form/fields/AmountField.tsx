
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { TransactionFormValues } from '../transaction-schema';

interface AmountFieldProps {
  control: Control<TransactionFormValues>;
}

export function AmountField({ control }: AmountFieldProps) {
  return (
    <FormField
      control={control}
      name="amount"
      render={({ field: { onChange, ...rest } }) => (
        <FormItem>
          <FormLabel>Valor (R$)</FormLabel>
          <FormControl>
            <Input 
              placeholder="0,00" 
              onChange={(e) => {
                // Allow input in the Brazilian currency format (comma as decimal separator)
                const value = e.target.value.replace(',', '.');
                onChange(value);
              }}
              {...rest}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
