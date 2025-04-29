
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransactionFormValues } from '../transaction-schema';

interface CategoryFieldProps {
  control: Control<TransactionFormValues>;
}

export function CategoryField({ control }: CategoryFieldProps) {
  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categoria</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="venda">Venda</SelectItem>
              <SelectItem value="financiamento">Financiamento</SelectItem>
              <SelectItem value="seguro">Seguro</SelectItem>
              <SelectItem value="comissão">Comissão</SelectItem>
              <SelectItem value="aluguel">Aluguel</SelectItem>
              <SelectItem value="salários">Salários</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="impostos">Impostos</SelectItem>
              <SelectItem value="documentação">Documentação</SelectItem>
              <SelectItem value="combustível">Combustível</SelectItem>
              <SelectItem value="manutenção">Manutenção</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
