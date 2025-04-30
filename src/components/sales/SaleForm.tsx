
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { saleSchema, SaleFormValues } from './form/FormSchema';
import { VehicleSelect } from './form/VehicleSelect';
import { CustomerSelect } from './form/CustomerSelect';
import { PaymentMethodSelect } from './form/PaymentMethodSelect';
import { FinalPriceInput } from './form/FinalPriceInput';
import { CommissionFields } from './form/CommissionFields';
import { CommissionPreview } from './form/CommissionPreview';
import { SubmitButton } from './form/SubmitButton';

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
      commissionType: 'fixed',
      commissionValue: 300, // Valor padrão de R$300
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
        <VehicleSelect 
          form={form} 
          vehicles={vehicles} 
          onVehicleChange={handleVehicleChange} 
        />

        {/* Customer Selection with Tabs */}
        <CustomerSelect 
          form={form} 
          customers={customers} 
          customerTab={customerTab}
          setCustomerTab={setCustomerTab}
          newCustomerId={newCustomerId}
          onNewCustomerCreated={handleNewCustomerCreated}
        />

        {/* Payment Method */}
        <PaymentMethodSelect form={form} />

        {/* Final Price */}
        <FinalPriceInput form={form} />

        {/* Commission Settings */}
        <CommissionFields form={form} />

        {/* Commission Preview */}
        <CommissionPreview selectedVehicle={selectedVehicle} watch={form.watch} />

        {/* Submit Button */}
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};
