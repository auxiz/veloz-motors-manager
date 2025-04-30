
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { SaleFormValues } from './FormSchema';

interface PaymentMethodSelectProps {
  form: UseFormReturn<SaleFormValues>;
}

export const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="paymentMethod"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Forma de Pagamento</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-veloz-black border-veloz-gray">
              <SelectItem value="cash">À Vista</SelectItem>
              <SelectItem value="financing">Financiamento</SelectItem>
              <SelectItem value="consignment">Consignação</SelectItem>
              <SelectItem value="exchange">Troca</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
