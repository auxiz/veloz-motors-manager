
import React from 'react';
import { CalculatorSection } from './CalculatorSection';
import { ApplicationForm } from './ApplicationForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFinancing } from './hooks/useFinancing';

interface FinancingSimulatorContainerProps {
  initialVehiclePrice?: number;
}

export const FinancingSimulatorContainer: React.FC<FinancingSimulatorContainerProps> = ({ initialVehiclePrice = 50000 }) => {
  const isMobile = useIsMobile();
  
  // Use our custom hook for financing logic
  const {
    vehiclePrice,
    entryValue,
    installments,
    monthlyPayment,
    totalPayment,
    financingAmount,
    interestRate,
    setVehiclePrice,
    setEntryValue,
    setInstallments
  } = useFinancing({ initialVehiclePrice });

  return (
    <div className={`max-w-3xl mx-auto ${isMobile ? 'px-4' : ''}`}>
      <CalculatorSection 
        vehiclePrice={vehiclePrice}
        entryValue={entryValue}
        installments={installments}
        onVehiclePriceChange={setVehiclePrice}
        onEntryValueChange={setEntryValue}
        onInstallmentsChange={setInstallments}
      />
      <ApplicationForm 
        vehiclePrice={vehiclePrice}
        entryValue={entryValue}
        installments={installments}
        monthlyPayment={monthlyPayment}
        totalPayment={totalPayment}
        financingAmount={financingAmount}
        interestRate={interestRate}
      />
    </div>
  );
};
