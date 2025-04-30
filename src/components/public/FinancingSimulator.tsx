
import React, { useState, useEffect } from 'react';
import { Calculator, CreditCard, Calendar, User, Check, Phone } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { formatCurrency } from '@/lib/utils';

// Validation schema
const formSchema = z.object({
  vehiclePrice: z.number().min(1000, "Valor deve ser no mínimo R$ 1.000"),
  entryValue: z.number().min(0, "Valor não pode ser negativo"),
  installments: z.number().int().min(12).max(60),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14),
  birthdate: z.string().min(1, "Data de nascimento é obrigatória"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  hasCNH: z.boolean().refine(val => val === true, {
    message: "É necessário ter CNH válida"
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const FinancingSimulator = () => {
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);

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

  const { watch, setValue } = form;
  const vehiclePrice = watch('vehiclePrice');
  const entryValue = watch('entryValue');
  const installments = watch('installments');

  // Format CPF input
  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      let formatted = digits;
      if (digits.length > 3) {
        formatted = `${digits.substring(0, 3)}.${digits.substring(3)}`;
      }
      if (digits.length > 6) {
        formatted = `${formatted.substring(0, 7)}.${formatted.substring(7)}`;
      }
      if (digits.length > 9) {
        formatted = `${formatted.substring(0, 11)}-${formatted.substring(11)}`;
      }
      return formatted;
    }
    return value;
  };

  // Format WhatsApp input
  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      let formatted = digits;
      if (digits.length > 0) {
        formatted = `(${digits.substring(0, 2)})${digits.substring(2)}`;
      }
      if (digits.length > 2) {
        formatted = `${formatted.substring(0, 4)} ${formatted.substring(4)}`;
      }
      if (digits.length > 7) {
        formatted = `${formatted.substring(0, 10)}-${formatted.substring(10)}`;
      }
      return formatted;
    }
    return value;
  };

  useEffect(() => {
    calculateFinancing(vehiclePrice, entryValue, installments);
  }, [vehiclePrice, entryValue, installments]);

  const calculateFinancing = (vehiclePrice: number, entryValue: number, installments: number) => {
    if (vehiclePrice <= 0 || installments <= 0) {
      setMonthlyPayment(null);
      setTotalPayment(null);
      return;
    }

    // Financing amount is vehicle price minus entry value
    const financingAmount = vehiclePrice - entryValue;
    
    // Monthly interest rate (1.49%)
    const monthlyInterest = 0.0149;
    
    // Calculate monthly payment using compound interest formula
    // PMT = P * r * (1 + r)^n / ((1 + r)^n - 1)
    // where P is principal (financing amount), r is interest rate, n is number of periods
    const monthlyPayment = financingAmount * monthlyInterest * Math.pow(1 + monthlyInterest, installments) / 
                        (Math.pow(1 + monthlyInterest, installments) - 1);
    
    // Total payment is monthly payment times number of installments
    const totalPayment = monthlyPayment * installments;
    
    setMonthlyPayment(monthlyPayment);
    setTotalPayment(totalPayment);
  };

  const onSubmit = async (data: FormValues) => {
    console.log('Form submitted', data);
    // Here you would typically send this data to your backend
    alert("Dados enviados com sucesso! Em breve, nossa equipe entrará em contato.");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-veloz-gray rounded-lg p-6 md:p-8 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-veloz-yellow mb-6 flex items-center">
          <Calculator className="mr-2" size={24} />
          Simulador de Financiamento
        </h2>
        
        <div className="space-y-6">
          {/* Vehicle Price Slider */}
          <div className="space-y-2">
            <label className="text-white font-medium block">Valor do Veículo</label>
            <div className="flex items-center space-x-4">
              <span className="text-white font-bold text-lg w-28">
                {formatCurrency(vehiclePrice)}
              </span>
              <Slider 
                value={[vehiclePrice]} 
                min={10000} 
                max={300000} 
                step={1000} 
                onValueChange={(value) => setValue('vehiclePrice', value[0])}
                className="flex-1"
              />
            </div>
          </div>
          
          {/* Entry Value Slider */}
          <div className="space-y-2">
            <label className="text-white font-medium block">Valor de Entrada</label>
            <div className="flex items-center space-x-4">
              <span className="text-white font-bold text-lg w-28">
                {formatCurrency(entryValue)}
              </span>
              <Slider 
                value={[entryValue]} 
                min={0} 
                max={vehiclePrice * 0.9} 
                step={1000} 
                onValueChange={(value) => setValue('entryValue', value[0])}
                className="flex-1"
              />
            </div>
          </div>
          
          {/* Installments Slider */}
          <div className="space-y-2">
            <label className="text-white font-medium block">Número de Parcelas</label>
            <div className="flex items-center space-x-4">
              <span className="text-white font-bold text-lg w-28">
                {installments} meses
              </span>
              <Slider 
                value={[installments]} 
                min={12} 
                max={60} 
                step={6} 
                onValueChange={(value) => setValue('installments', value[0])}
                className="flex-1"
              />
            </div>
          </div>
          
          {/* Results */}
          <div className="bg-veloz-black border border-veloz-yellow rounded-lg p-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="text-center md:text-left">
                <p className="text-veloz-yellow font-medium">Parcela Mensal</p>
                <p className="text-white text-2xl font-bold">
                  {monthlyPayment ? formatCurrency(monthlyPayment) : 'R$ 0,00'}
                </p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-veloz-yellow font-medium">Total a Pagar</p>
                <p className="text-white text-2xl font-bold">
                  {totalPayment ? formatCurrency(totalPayment) : 'R$ 0,00'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4 text-center">
              * Simulação apenas. Sujeito à análise bancária.
            </p>
          </div>
        </div>
      </div>
      
      {/* Application Form */}
      <div className="bg-veloz-gray rounded-lg p-6 md:p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-veloz-yellow mb-6 flex items-center">
          <CreditCard className="mr-2" size={24} />
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
                      prefix={<User size={18} />}
                      placeholder="000.000.000-00"
                      onChange={(e) => {
                        const formattedValue = formatCPF(e.target.value);
                        field.onChange(formattedValue);
                      }}
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
                      prefix={<Calendar size={18} />}
                      type="date"
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
                      prefix={<Phone size={18} />}
                      placeholder="(00) 00000-0000"
                      onChange={(e) => {
                        const formattedValue = formatWhatsApp(e.target.value);
                        field.onChange(formattedValue);
                      }}
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
              className="w-full bg-veloz-yellow hover:bg-amber-500 text-veloz-black font-bold"
            >
              Enviar Solicitação
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
