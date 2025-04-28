
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { NewCustomerForm } from '@/components/customers/NewCustomerForm';

const saleSchema = z.object({
  vehicleId: z.string().min(1, { message: 'Selecione um veículo' }),
  customerId: z.string().min(1, { message: 'Selecione um cliente' }),
  finalPrice: z.number().min(1, { message: 'Digite um valor válido' }),
  paymentMethod: z.string().min(1, { message: 'Selecione uma forma de pagamento' }),
  commissionType: z.enum(['fixed', 'percentage']),
  commissionValue: z.number().min(0, { message: 'Digite um valor válido para comissão' }),
});

type SaleFormValues = z.infer<typeof saleSchema>;

interface SaleFormProps {
  vehicles: any[];
  customers: any[];
  onSubmit: (data: SaleFormValues) => void;
  isSubmitting: boolean;
}

export const SaleForm: React.FC<SaleFormProps> = ({ vehicles, customers, onSubmit, isSubmitting }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [customerTab, setCustomerTab] = useState('existing');
  const [newCustomerId, setNewCustomerId] = useState<string | null>(null);

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      vehicleId: '',
      customerId: '',
      finalPrice: 0,
      paymentMethod: 'cash',
      commissionType: 'percentage',
      commissionValue: 5, // Default 5%
    },
  });

  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    setSelectedVehicle(vehicle);
    form.setValue('finalPrice', vehicle ? vehicle.sale_price : 0);
  };

  const handleNewCustomerCreated = (customerId: string) => {
    setNewCustomerId(customerId);
    setCustomerTab('existing');
    form.setValue('customerId', customerId);
  };

  const handleFinalSubmit = (values: SaleFormValues) => {
    onSubmit({
      ...values,
      finalPrice: Number(values.finalPrice),
      commissionValue: Number(values.commissionValue),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6">
        {/* Vehicle Selection */}
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Veículo</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleVehicleChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um veículo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} {vehicle.version} ({vehicle.year}) - {formatCurrency(vehicle.sale_price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Customer Selection with Tabs */}
        <div className="space-y-2">
          <FormLabel>Cliente</FormLabel>
          <Tabs value={customerTab} onValueChange={setCustomerTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Cliente Existente</TabsTrigger>
              <TabsTrigger value="new">Novo Cliente</TabsTrigger>
            </TabsList>
            <TabsContent value="existing" className="pt-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={newCustomerId || field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} ({customer.document})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="new" className="pt-4">
              <NewCustomerForm
                onCustomerCreated={handleNewCustomerCreated}
                embedded={true}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Payment Method */}
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
                <SelectContent>
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

        {/* Final Price */}
        <FormField
          control={form.control}
          name="finalPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Final</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Valor da venda"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Commission Settings */}
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
                  <SelectContent>
                    <SelectItem value="percentage">Percentual (%)</SelectItem>
                    <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
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

        {/* Commission Preview */}
        {selectedVehicle && (
          <div className="p-4 bg-veloz-black rounded-md">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Valor da Venda:</span>
              <span className="text-veloz-yellow font-semibold">
                {formatCurrency(form.watch('finalPrice'))}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-400">Comissão Estimada:</span>
              <span className="text-veloz-yellow font-semibold">
                {formatCurrency(
                  form.watch('commissionType') === 'fixed'
                    ? form.watch('commissionValue')
                    : (form.watch('finalPrice') * form.watch('commissionValue')) / 100
                )}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-veloz-yellow hover:bg-yellow-500 text-black font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Venda'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
