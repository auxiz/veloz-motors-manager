import { useState, useEffect } from 'react';
import { calculateFinancing } from '../utils/formatters';

interface UseFinancingProps {
  initialVehiclePrice?: number;
}

export const useFinancing = ({ initialVehiclePrice = 50000 }: UseFinancingProps) => {
  const [vehiclePrice, setVehiclePrice] = useState(initialVehiclePrice);
  const [entryValue, setEntryValue] = useState(Math.round(initialVehiclePrice * 0.2)); // Default 20% entry
  const [installments, setInstallments] = useState(36);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [financingAmount, setFinancingAmount] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);

  // Update entry value when vehicle price changes
  useEffect(() => {
    // Recalculate entry value when vehicle price changes (keep same percentage)
    const currentPercentage = entryValue / (vehiclePrice || initialVehiclePrice);
    setEntryValue(Math.round(vehiclePrice * currentPercentage));
  }, [initialVehiclePrice]);

  // Calculate the financing values when inputs change
  useEffect(() => {
    const { monthlyPayment, totalPayment, financingAmount, interestRate } = calculateFinancing(vehiclePrice, entryValue, installments);
    setMonthlyPayment(monthlyPayment);
    setTotalPayment(totalPayment);
    setFinancingAmount(financingAmount);
    setInterestRate(interestRate);
  }, [vehiclePrice, entryValue, installments]);

  return {
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
  };
};
