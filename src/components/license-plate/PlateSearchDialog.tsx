
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LookupForm } from './LookupForm';
import { ResultDisplay } from './ResultDisplay';
import { PlateSearchResult, useLicensePlateLookup } from '@/hooks/useLicensePlateLookup';
import { VehicleFormData } from '@/components/inventory/vehicle-form/VehicleFormSchema';

interface PlateSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataSelected?: (vehicleData: Partial<VehicleFormData>) => void;
}

export const PlateSearchDialog: React.FC<PlateSearchDialogProps> = ({ 
  open, 
  onOpenChange,
  onDataSelected 
}) => {
  const [result, setResult] = useState<PlateSearchResult | null>(null);
  const { mapResultToVehicle } = useLicensePlateLookup();

  const handleResultFound = (data: PlateSearchResult) => {
    setResult(data);
  };

  const handleUseData = () => {
    if (result && onDataSelected) {
      const vehicleData = mapResultToVehicle(result);
      // Convert Vehicle to VehicleFormData
      const formData: Partial<VehicleFormData> = {
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        color: vehicleData.color,
        chassis: vehicleData.chassis,
        renavam: vehicleData.renavam,
        plate: vehicleData.plate,
        fuel: vehicleData.fuel,
        mileage: vehicleData.mileage,
        transmission: vehicleData.transmission,
        purchase_price: vehicleData.purchase_price,
        sale_price: vehicleData.sale_price,
        internal_notes: vehicleData.internal_notes,
        status: vehicleData.status as "in_stock" | "reserved" | "sold",
        photos: vehicleData.photos,
      };
      onDataSelected(formData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-veloz-gray border-veloz-gray">
        <DialogHeader>
          <DialogTitle>Consulta por Placa</DialogTitle>
          <DialogDescription>
            Insira a placa do veículo para buscar informações.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <LookupForm onResultFound={handleResultFound} />
          
          {result && (
            <>
              <ResultDisplay 
                result={result} 
                onRegisterVehicle={onDataSelected ? handleUseData : undefined}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
