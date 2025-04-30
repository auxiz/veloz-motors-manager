
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../CustomerFormSchema';

interface NotesFieldProps {
  form: UseFormReturn<CustomerFormValues>;
}

export const NotesField: React.FC<NotesFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="internal_notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Anotações Internas</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Observações importantes, preferências, etc." 
              className="min-h-[80px]"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
