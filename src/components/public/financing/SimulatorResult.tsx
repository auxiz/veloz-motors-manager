
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SimulatorResultProps {
  monthlyPayment: number | null;
  totalPayment: number | null;
}

export const SimulatorResult: React.FC<SimulatorResultProps> = ({ 
  monthlyPayment, 
  totalPayment 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`bg-veloz-black border border-veloz-yellow rounded-lg ${isMobile ? 'p-4' : 'p-6'} mt-8`}>
      <div className={`${isMobile ? 'space-y-4' : 'flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4'}`}>
        <div className="text-center md:text-left">
          <p className="text-veloz-yellow font-medium text-sm md:text-base">Parcela Mensal</p>
          <p className="text-white text-xl md:text-2xl font-bold">
            {monthlyPayment ? formatCurrency(monthlyPayment) : 'R$ 0,00'}
          </p>
        </div>
        <div className={`text-center md:text-left ${isMobile ? 'pt-2 border-t border-gray-700' : ''}`}>
          <p className="text-veloz-yellow font-medium text-sm md:text-base">Total a Pagar</p>
          <p className="text-white text-xl md:text-2xl font-bold">
            {totalPayment ? formatCurrency(totalPayment) : 'R$ 0,00'}
          </p>
        </div>
      </div>
      <p className="text-xs md:text-sm text-gray-400 mt-4 text-center">
        * Simulação apenas. Sujeito à análise bancária.
      </p>
    </div>
  );
};
