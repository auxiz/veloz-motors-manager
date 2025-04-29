
import React, { useState } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { useCustomers } from '@/hooks/useCustomers';
import { useSales } from '@/hooks/useSales';
import { useUsers } from '@/hooks/useUsers';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SaleForm } from './SaleForm';
import { toast } from 'sonner';

interface NewSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewSaleDialog: React.FC<NewSaleDialogProps> = ({ open, onOpenChange }) => {
  const { vehicles } = useVehicles();
  const { customers } = useCustomers();
  const { addSale } = useSales();
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
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }
    
    if (!user.id) {
      toast.error('ID de usuário não disponível');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Registrando venda com dados:', data);
      console.log('Usuário atual:', user);
      
      // Calculate commission amount
      const commissionAmount = data.commissionType === 'fixed'
        ? data.commissionValue
        : (data.finalPrice * data.commissionValue / 100);

      // Register the sale
      await addSale.mutateAsync({
        vehicle_id: data.vehicleId,
        customer_id: data.customerId,
        final_price: data.finalPrice,
        payment_method: data.paymentMethod,
        seller_id: user.id,
        commission_amount: commissionAmount,
        sale_date: new Date().toISOString(), // Garantir que a data está no formato correto
      });

      toast.success('Venda registrada com sucesso!');
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      toast.error('Erro ao registrar venda. Verifique o console para mais detalhes.');
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
