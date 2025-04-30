
import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { SimulatorSlider } from './SimulatorSlider';
import { SimulatorResult } from './SimulatorResult';
import { calculateFinancing } from './utils/formatters';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalculatorSectionProps {
  vehiclePrice: number;
  entryValue: number;
  installments: number;
  onVehiclePriceChange: (value: number) => void;
  onEntryValueChange: (value: number) => void;
  onInstallmentsChange: (value: number) => void;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  vehiclePrice,
  entryValue,
  installments,
  onVehiclePriceChange,
  onEntryValueChange,
  onInstallmentsChange,
}) => {
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [financingAmount, setFinancingAmount] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const { monthlyPayment, totalPayment, financingAmount, interestRate } = calculateFinancing(vehiclePrice, entryValue, installments);
    setMonthlyPayment(monthlyPayment);
    setTotalPayment(totalPayment);
    setFinancingAmount(financingAmount);
    setInterestRate(interestRate);
  }, [vehiclePrice, entryValue, installments]);

  // Calculate entry percentage for display
  const entryPercentage = ((entryValue / vehiclePrice) * 100).toFixed(1);

  return (
    <div className={`bg-veloz-gray rounded-lg ${isMobile ? 'p-4' : 'p-6 md:p-8'} shadow-lg mb-6`}>
      <h2 className="text-xl md:text-2xl font-bold text-veloz-yellow mb-6 flex items-center">
        <Calculator className="mr-2" size={isMobile ? 20 : 24} />
        Simulador de Financiamento
      </h2>
      
      <div className="space-y-6">
        {/* Vehicle Price Slider */}
        <SimulatorSlider
          label="Valor do Veículo"
          value={vehiclePrice}
          min={10000}
          max={300000}
          step={1000}
          unit="currency"
          onChange={onVehiclePriceChange}
        />
        
        {/* Entry Value Slider */}
        <SimulatorSlider
          label={`Valor de Entrada (${entryPercentage}%)`}
          value={entryValue}
          min={0}
          max={vehiclePrice * 0.9}
          step={1000}
          unit="currency"
          onChange={onEntryValueChange}
        />
        
        {/* Installments Slider */}
        <SimulatorSlider
          label="Número de Parcelas"
          value={installments}
          min={12}
          max={60}
          step={6}
          unit=" meses"
          onChange={onInstallmentsChange}
        />
        
        {/* Results */}
        <SimulatorResult
          monthlyPayment={monthlyPayment}
          totalPayment={totalPayment}
          financingAmount={financingAmount}
          interestRate={interestRate}
        />
      </div>
    </div>
  );
};
