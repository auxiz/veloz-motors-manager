
import React from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehicleForm, VehicleFormData } from './vehicle-form/VehicleForm';
import { useInvestors } from '@/hooks/useInvestors';
import { toast } from 'sonner';

interface NewVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<VehicleFormData>;
}

export const NewVehicleDialog = ({ 
  open, 
  onOpenChange, 
  initialData 
}: NewVehicleDialogProps) => {
  const { addVehicle } = useVehicles();
  const { updateVehicleAccess } = useInvestors();

  const handleSubmit = async (data: VehicleFormData) => {
    try {
      // First, add the vehicle to get its ID
      const newVehicle = await addVehicle.mutateAsync({
        brand: data.brand,
        model: data.model,
        version: data.version || null,
        year: data.year,
        color: data.color,
        plate: data.plate || null,
        renavam: data.renavam || null,
        chassis: data.chassis || null,
        mileage: data.mileage,
        fuel: data.fuel,
        transmission: data.transmission,
        purchase_price: data.purchase_price,
        sale_price: data.sale_price,
        status: data.status,
        entry_date: new Date().toISOString(),
        photos: data.photos || null,
        internal_notes: data.internal_notes || '',
      });

      // Then update investor access if provided
      if (data.investorAccess && data.investorAccess.length > 0 && newVehicle.id) {
        await updateVehicleAccess.mutateAsync({
          vehicleId: newVehicle.id,
          investorIds: data.investorAccess
        });
        toast.success('Acesso de investidores configurado com sucesso!');
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Erro ao adicionar veículo');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-veloz-gray border-veloz-gray max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Novo Veículo</DialogTitle>
          <DialogDescription>
            Preencha os dados do veículo para adicioná-lo ao estoque.
          </DialogDescription>
        </DialogHeader>
        
        <VehicleForm 
          onSubmit={handleSubmit} 
          isLoading={addVehicle.isPending}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};
