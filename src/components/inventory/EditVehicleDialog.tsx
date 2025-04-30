
import React from 'react';
import { useVehicles, Vehicle } from '@/hooks/useVehicles';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehicleForm, VehicleFormData } from './vehicle-form/VehicleForm';

interface EditVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

export const EditVehicleDialog = ({ 
  open, 
  onOpenChange, 
  vehicle 
}: EditVehicleDialogProps) => {
  const { updateVehicle } = useVehicles();

  const handleSubmit = async (data: VehicleFormData) => {
    if (!vehicle) return;
    
    try {
      await updateVehicle.mutateAsync({
        ...vehicle,
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
        internal_notes: data.internal_notes || null,
        photos: data.photos || vehicle.photos,
        status: data.status
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  if (!vehicle) return null;

  // Ensure status is one of the allowed values from the schema
  const vehicleStatus = vehicle.status === 'in_stock' || 
                       vehicle.status === 'reserved' || 
                       vehicle.status === 'sold' 
                       ? vehicle.status 
                       : 'in_stock';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-veloz-gray border-veloz-gray max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Editar Veículo
          </DialogTitle>
          <DialogDescription>
            Edite os dados do veículo {vehicle.brand} {vehicle.model}.
          </DialogDescription>
        </DialogHeader>
        
        <VehicleForm 
          onSubmit={handleSubmit} 
          isLoading={updateVehicle.isPending}
          initialData={{
            brand: vehicle.brand,
            model: vehicle.model,
            version: vehicle.version || '',
            year: vehicle.year,
            color: vehicle.color,
            plate: vehicle.plate || '',
            renavam: vehicle.renavam || '',
            chassis: vehicle.chassis || '',
            mileage: vehicle.mileage,
            fuel: vehicle.fuel,
            transmission: vehicle.transmission,
            purchase_price: vehicle.purchase_price,
            sale_price: vehicle.sale_price,
            internal_notes: vehicle.internal_notes || '',
            photos: vehicle.photos,
            status: vehicleStatus
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
