
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from './FormSchema';
import { CalculatorSection } from './CalculatorSection';
import { ApplicationForm } from './ApplicationForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateFinancing } from './utils/formatters';

export const FinancingSimulatorContainer = () => {
  const [vehiclePrice, setVehiclePrice] = useState(50000);
  const [entryValue, setEntryValue] = useState(10000);
  const [installments, setInstallments] = useState(36);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [financingAmount, setFinancingAmount] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const isMobile = useIsMobile();

  // Calculate the financing values when inputs change
  useEffect(() => {
    const { monthlyPayment, totalPayment, financingAmount, interestRate } = calculateFinancing(vehiclePrice, entryValue, installments);
    setMonthlyPayment(monthlyPayment);
    setTotalPayment(totalPayment);
    setFinancingAmount(financingAmount);
    setInterestRate(interestRate);
  }, [vehiclePrice, entryValue, installments]);

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
