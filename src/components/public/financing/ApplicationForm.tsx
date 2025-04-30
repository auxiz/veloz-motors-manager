
import React from 'react';
import { CreditCard, User, Calendar, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { formSchema, FormValues } from './FormSchema';
import { formatCPF, formatWhatsApp } from './utils/formatters';
import { useIsMobile } from '@/hooks/use-mobile';

export const ApplicationForm: React.FC = () => {
  const isMobile = useIsMobile();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehiclePrice: 50000,
      entryValue: 10000,
      installments: 36,
      cpf: '',
      birthdate: '',
      whatsapp: '',
      hasCNH: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log('Form submitted', data);
    // Here you would typically send this data to your backend
    alert("Dados enviados com sucesso! Em breve, nossa equipe entrará em contato.");
  };

  return (
    <div className={`bg-veloz-gray rounded-lg ${isMobile ? 'p-4' : 'p-6 md:p-8'} shadow-lg`}>
      <h2 className="text-xl md:text-2xl font-bold text-veloz-yellow mb-6 flex items-center">
        <CreditCard className="mr-2" size={isMobile ? 20 : 24} />
        Solicitar Financiamento
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* CPF Field */}
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">CPF</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    prefix={<User size={isMobile ? 16 : 18} />}
                    placeholder="000.000.000-00"
                    onChange={(e) => {
                      const formattedValue = formatCPF(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    className={isMobile ? "h-12 text-base" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Birthdate Field */}
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Data de Nascimento</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    prefix={<Calendar size={isMobile ? 16 : 18} />}
                    type="date"
                    className={isMobile ? "h-12 text-base" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* WhatsApp Field */}
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Contato WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    prefix={<Phone size={isMobile ? 16 : 18} />}
                    placeholder="(00) 00000-0000"
                    onChange={(e) => {
                      const formattedValue = formatWhatsApp(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    className={isMobile ? "h-12 text-base" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* CNH Checkbox */}
          <FormField
            control={form.control}
            name="hasCNH"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={isMobile ? "h-5 w-5" : ""}
                  />
                </FormControl>
                <FormLabel className="text-white font-normal mt-0">
                  Possuo CNH válida
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className={`w-full bg-veloz-yellow hover:bg-amber-500 text-veloz-black font-bold ${isMobile ? 'text-base h-14' : ''}`}
          >
            Enviar Solicitação
          </Button>
        </form>
      </Form>
    </div>
  );
};
