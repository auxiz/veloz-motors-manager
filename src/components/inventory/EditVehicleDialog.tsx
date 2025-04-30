import React, { useState, useEffect } from 'react';
import { useVehicles, Vehicle } from '@/hooks/useVehicles';
import { useSales, Sale } from '@/hooks/useSales';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehicleForm, VehicleFormData } from './vehicle-form/VehicleForm';
import { toast } from 'sonner';
import { DeleteSaleConfirmDialog } from './DeleteSaleConfirmDialog';

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
  const { getSalesByVehicleId, deleteSale } = useSales();
  const [relatedSale, setRelatedSale] = useState<Sale | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<VehicleFormData | null>(null);

  // Check for related sales when dialog opens and vehicle has changed
  useEffect(() => {
    const checkForSales = async () => {
      if (vehicle && open && vehicle.status === 'sold') {
        try {
          const vehicleSales = await getSalesByVehicleId(vehicle.id);
          if (vehicleSales.length > 0) {
            setRelatedSale(vehicleSales[0]);
          } else {
            setRelatedSale(null);
          }
        } catch (error) {
          console.error('Error checking for vehicle sales:', error);
          setRelatedSale(null);
        }
      } else {
        setRelatedSale(null);
      }
    };

    checkForSales();
  }, [vehicle, open, getSalesByVehicleId]);

  const handleSubmit = async (data: VehicleFormData) => {
    if (!vehicle) return;
    
    // Check if changing from 'sold' to another status and related sale exists
    if (vehicle.status === 'sold' && data.status !== 'sold' && relatedSale) {
      setPendingFormData(data);
      setConfirmDialogOpen(true);
      return;
    }
    
    // Otherwise, proceed with normal update
    await updateVehicleData(data);
  };

  const updateVehicleData = async (data: VehicleFormData) => {
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

  const handleConfirmDeleteSale = async () => {
    if (!relatedSale || !pendingFormData) return;

    try {
      await deleteSale.mutateAsync(relatedSale.id);
      toast.success('Venda excluída e veículo marcado como em estoque');
      await updateVehicleData(pendingFormData);
      setConfirmDialogOpen(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Erro ao excluir venda');
    }
  };

  const handleKeepSale = async () => {
    if (!pendingFormData) return;
    
    // Just update the vehicle without deleting the sale
    await updateVehicleData(pendingFormData);
    toast.info('Status do veículo atualizado, mas o registro de venda foi mantido');
    setConfirmDialogOpen(false);
  };

  if (!vehicle) return null;

  // Ensure status is one of the allowed values from the schema
  const vehicleStatus = vehicle.status === 'in_stock' || 
                       vehicle.status === 'reserved' || 
                       vehicle.status === 'sold' 
                       ? vehicle.status 
                       : 'in_stock';

  return (
    <>
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

      <DeleteSaleConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirmDeleteSale={handleConfirmDeleteSale}
        onKeepSale={handleKeepSale}
        vehicleName={`${vehicle.brand} ${vehicle.model}`}
      />
    </>
  );
};
