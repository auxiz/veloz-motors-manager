
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { SaleFormValues } from './FormSchema';

interface FinalPriceInputProps {
  form: UseFormReturn<SaleFormValues>;
}

export const FinalPriceInput: React.FC<FinalPriceInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="finalPrice"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Valor Final</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Valor da venda"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
