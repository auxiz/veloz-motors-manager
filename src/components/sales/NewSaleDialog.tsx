
import React, { useState } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { useCustomers } from '@/hooks/useCustomers';
import { useSales } from '@/hooks/useSales';
import { useTransactions } from '@/hooks/useTransactions';
import { useUsers } from '@/hooks/useUsers';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SaleForm } from './SaleForm';

interface NewSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewSaleDialog: React.FC<NewSaleDialogProps> = ({ open, onOpenChange }) => {
  const { vehicles } = useVehicles();
  const { customers } = useCustomers();
  const { addSale } = useSales();
  const { addTransaction } = useTransactions();
  const { user } = useUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableVehicles = vehicles.filter(vehicle => vehicle.status === 'in_stock');

  const handleSubmit = async (data: {
    vehicleId: string;
    customerId: string;
    finalPrice: number;
    paymentMethod: string;
    commissionType: 'fixed' | 'percentage';
    commissionValue: number;
  }) => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      // Calculate commission amount
      const commissionAmount = data.commissionType === 'fixed'
        ? data.commissionValue
        : (data.finalPrice * data.commissionValue / 100);

      // Register the sale
      const result = await addSale.mutateAsync({
        vehicle_id: data.vehicleId,
        customer_id: data.customerId,
        final_price: data.finalPrice,
        payment_method: data.paymentMethod,
        seller_id: user.id,
        commission_amount: commissionAmount,
        sale_date: new Date().toISOString(),
      });

      // Create a financial transaction for this sale
      if (result) {
        await addTransaction.mutateAsync({
          type: 'income',
          category: 'vehicle_sale',
          description: `Venda de veículo - ID: ${data.vehicleId}`,
          amount: data.finalPrice,
          due_date: new Date().toISOString().split('T')[0],
          status: data.paymentMethod === 'cash' ? 'paid' : 'pending',
          sale_id: result.id,
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error registering sale:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-veloz-gray border-veloz-gray max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Registrar Nova Venda</DialogTitle>
        </DialogHeader>
        
        <SaleForm 
          vehicles={availableVehicles}
          customers={customers}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
