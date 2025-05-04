
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { LookupForm } from '@/components/license-plate/LookupForm';
import { ResultDisplay } from '@/components/license-plate/ResultDisplay';
import { PlateSearchResult } from '@/hooks/useLicensePlateLookup';
import { NewVehicleDialog } from '@/components/inventory/NewVehicleDialog';
import { useLicensePlateLookup } from '@/hooks/useLicensePlateLookup';
import { Vehicle } from '@/hooks/useVehicles';

const ConsultaPlaca = () => {
  const [result, setResult] = useState<PlateSearchResult | null>(null);
  const [newVehicleDialogOpen, setNewVehicleDialogOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState<Partial<Vehicle> | null>(null);
  const { mapResultToVehicle } = useLicensePlateLookup();
  
  const handleResultFound = (data: PlateSearchResult) => {
    setResult(data);
  };

  const handleRegisterVehicle = () => {
    if (result) {
      const mappedData = mapResultToVehicle(result);
      setVehicleData(mappedData);
      setNewVehicleDialogOpen(true);
    }
  };

  return (
    <AuthGuard>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Consulta por Placa</h1>
        </div>
        
        <Card className="bg-veloz-gray border-veloz-gray p-6">
          <div className="max-w-md mx-auto">
            <LookupForm onResultFound={handleResultFound} />
          </div>
        </Card>
        
        {result && (
          <ResultDisplay 
            result={result}
            onRegisterVehicle={handleRegisterVehicle}
          />
        )}

        <NewVehicleDialog 
          open={newVehicleDialogOpen}
          onOpenChange={setNewVehicleDialogOpen}
          initialData={vehicleData}
        />
      </div>
    </AuthGuard>
  );
};

export default ConsultaPlaca;
