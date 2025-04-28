
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

interface NewVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewVehicleDialog = ({ open, onOpenChange }: NewVehicleDialogProps) => {
  const { addVehicle } = useVehicles();

  const handleSubmit = async (data: VehicleFormData) => {
    try {
      await addVehicle.mutateAsync({
        ...data,
        status: 'in_stock',
        entry_date: new Date().toISOString(),
        photos: null, // Adding the missing photos property with null as default
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding vehicle:', error);
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
        />
      </DialogContent>
    </Dialog>
  );
};
