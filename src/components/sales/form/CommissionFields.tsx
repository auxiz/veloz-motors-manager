
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { SaleFormValues } from './FormSchema';

interface CommissionFieldsProps {
  form: UseFormReturn<SaleFormValues>;
}

export const CommissionFields: React.FC<CommissionFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="commissionType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Comissão</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de comissão" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-veloz-black border-veloz-gray">
                <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                <SelectItem value="percentage">Percentual (%)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="commissionValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor da Comissão {form.watch('commissionType') === 'percentage' ? '(%)' : '(R$)'}</FormLabel>
            <FormControl>
              <Input
                type="number"
                step={form.watch('commissionType') === 'percentage' ? '0.01' : '1'}
                placeholder={form.watch('commissionType') === 'percentage' ? 'Porcentagem' : 'Valor em R$'}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
