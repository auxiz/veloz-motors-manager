
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from './FormSchema';
import { CalculatorSection } from './CalculatorSection';
import { ApplicationForm } from './ApplicationForm';
import { useIsMobile } from '@/hooks/use-mobile';

export const FinancingSimulatorContainer = () => {
  const [vehiclePrice, setVehiclePrice] = useState(50000);
  const [entryValue, setEntryValue] = useState(10000);
  const [installments, setInstallments] = useState(36);
  const isMobile = useIsMobile();

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
      <ApplicationForm />
    </div>
  );
};
