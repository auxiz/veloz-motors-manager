
import React from 'react';
import { Calculator } from 'lucide-react';
import { FinancingSimulatorContainer } from '@/components/public/financing/FinancingSimulatorContainer';

interface VehicleFinancingProps {
  show: boolean;
  vehiclePrice: number;
}

export const VehicleFinancingSection: React.FC<VehicleFinancingProps> = ({ show, vehiclePrice }) => {
  if (!show) return null;

  return (
    <div className="mt-8 pt-8 border-t border-veloz-gray">
      <h2 className="text-2xl font-montserrat font-bold mb-6 text-white flex items-center gap-2">
        <Calculator className="text-veloz-yellow" />
        Simulação de Financiamento
      </h2>
      <FinancingSimulatorContainer initialVehiclePrice={vehiclePrice} />
    </div>
  );
};
