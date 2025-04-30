
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
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface ApplicationFormProps {
  vehiclePrice: number;
  entryValue: number;
  installments: number;
  monthlyPayment: number | null;
  totalPayment: number | null;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  vehiclePrice,
  entryValue,
  installments,
  monthlyPayment,
  totalPayment
}) => {
  const isMobile = useIsMobile();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehiclePrice,
      entryValue,
      installments,
      cpf: '',
      birthdate: '',
      whatsapp: '',
      hasCNH: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Show loading toast
      toast.loading("Enviando solicitação...");
      
      // Send the data to our edge function
      const response = await fetch("https://lmevzqjaxzbvsyiswwby.supabase.co/functions/v1/send-financing-email", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          monthlyPayment: monthlyPayment || 0,
          totalPayment: totalPayment || 0
        })
      });
      
      const result = await response.json();
      
      // Dismiss the loading toast
      toast.dismiss();
      
      if (result.success) {
        // Show success toast
        toast.success("Solicitação enviada com sucesso! Em breve entraremos em contato.");
        form.reset(); // Reset form after successful submission
      } else {
        // Show error toast
        toast.error("Falha ao enviar solicitação. Por favor tente novamente.");
        console.error("Error sending financing request:", result);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Erro ao processar sua solicitação. Por favor tente novamente.");
      console.error("Submission error:", error);
    }
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
