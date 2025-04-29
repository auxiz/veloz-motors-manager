
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { UserFormValues } from '../CreateUserForm';

interface NameFieldProps {
  control: Control<UserFormValues>;
}

export function NameField({ control }: NameFieldProps) {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome</FormLabel>
          <FormControl>
            <Input placeholder="Nome do usuário" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
