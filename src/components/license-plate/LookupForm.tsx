
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLicensePlateLookup } from '@/hooks/useLicensePlateLookup';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const formSchema = z.object({
  plate: z.string().min(7, "Placa inválida").max(8, "Placa inválida"),
});

type FormValues = z.infer<typeof formSchema>;

interface LookupFormProps {
  onResultFound: (result: any) => void;
}

export const LookupForm: React.FC<LookupFormProps> = ({ onResultFound }) => {
  const { searchByPlate, isLoading } = useLicensePlateLookup();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    const result = await searchByPlate(data.plate);
    if (result?.success) {
      onResultFound(result);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa do Veículo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: ABC1234" 
                  {...field} 
                  autoFocus
                  autoCapitalize="characters"
                  className="uppercase"
                  maxLength={8}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-veloz-yellow text-veloz-black hover:bg-opacity-90 w-full"
        >
          {isLoading ? 'Consultando...' : 'Buscar Dados'}
          <Search className="ml-2" size={18} />
        </Button>
      </form>
    </Form>
  );
};
