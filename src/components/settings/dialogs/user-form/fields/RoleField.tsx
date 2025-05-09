
import React from 'react';
import { Control } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UserFormValues } from '../CreateUserForm';

interface RoleFieldProps {
  control: Control<UserFormValues>;
}

export function RoleField({ control }: RoleFieldProps) {
  return (
    <FormField
      control={control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Função</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="administrator">Administrador - Acesso total</SelectItem>
                <SelectItem value="seller">Vendedor - Gestão de vendas</SelectItem>
                <SelectItem value="financial">Financeiro - Gestão financeira</SelectItem>
                <SelectItem value="dispatcher">Despachante - Documentação</SelectItem>
                <SelectItem value="investor">Investidor - Visualização de investimentos</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
