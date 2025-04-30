
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface SimulatorResultProps {
  monthlyPayment: number | null;
  totalPayment: number | null;
}

export const SimulatorResult: React.FC<SimulatorResultProps> = ({ 
  monthlyPayment, 
  totalPayment 
}) => {
  return (
    <div className="bg-veloz-black border border-veloz-yellow rounded-lg p-6 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="text-center md:text-left">
          <p className="text-veloz-yellow font-medium">Parcela Mensal</p>
          <p className="text-white text-2xl font-bold">
            {monthlyPayment ? formatCurrency(monthlyPayment) : 'R$ 0,00'}
          </p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-veloz-yellow font-medium">Total a Pagar</p>
          <p className="text-white text-2xl font-bold">
            {totalPayment ? formatCurrency(totalPayment) : 'R$ 0,00'}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-4 text-center">
        * Simulação apenas. Sujeito à análise bancária.
      </p>
    </div>
  );
};
