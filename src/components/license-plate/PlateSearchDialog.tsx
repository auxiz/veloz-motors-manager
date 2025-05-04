
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
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/hooks/useVehicles';
import { PlateSearchResult, useLicensePlateLookup } from '@/hooks/useLicensePlateLookup';

interface PlateSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataSelected?: (vehicleData: Partial<Vehicle>) => void;
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
      onDataSelected(vehicleData);
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
