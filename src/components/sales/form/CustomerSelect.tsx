
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewCustomerForm } from '@/components/customers/NewCustomerForm';
import { UseFormReturn } from 'react-hook-form';
import { SaleFormValues } from './FormSchema';

interface CustomerSelectProps {
  form: UseFormReturn<SaleFormValues>;
  customers: any[];
  customerTab: string;
  setCustomerTab: (tab: string) => void;
  newCustomerId: string | null;
  onNewCustomerCreated: (customerId: string) => void;
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({ 
  form, 
  customers, 
  customerTab, 
  setCustomerTab, 
  newCustomerId, 
  onNewCustomerCreated 
}) => {
  return (
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
                  <SelectContent className="bg-veloz-black border-veloz-gray max-h-[300px]">
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
            onCustomerCreated={onNewCustomerCreated}
            embedded={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
