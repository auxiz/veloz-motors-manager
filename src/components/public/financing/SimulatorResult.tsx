
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SimulatorResultProps {
  monthlyPayment: number | null;
  totalPayment: number | null;
  financingAmount: number | null;
  interestRate: number | null;
}

export const SimulatorResult: React.FC<SimulatorResultProps> = ({ 
  monthlyPayment, 
  totalPayment,
  financingAmount,
  interestRate
}) => {
  const isMobile = useIsMobile();

  // Format interest rate as percentage
  const formattedInterestRate = interestRate 
    ? `${(interestRate * 100).toFixed(2)}% a.m.` 
    : '0.00% a.m.';
  
  return (
    <div className={`bg-veloz-black border border-veloz-yellow rounded-lg ${isMobile ? 'p-4' : 'p-6'} mt-8`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <p className="text-veloz-yellow font-medium text-sm md:text-base">Valor Financiado</p>
            <p className="text-white text-xl md:text-2xl font-bold">
              {financingAmount ? formatCurrency(financingAmount) : 'R$ 0,00'}
            </p>
          </div>
          
          <div>
            <p className="text-veloz-yellow font-medium text-sm md:text-base">Taxa de Juros</p>
            <p className="text-white text-xl md:text-2xl font-bold">
              {formattedInterestRate}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-veloz-yellow font-medium text-sm md:text-base">Parcela Mensal</p>
            <p className="text-white text-xl md:text-2xl font-bold">
              {monthlyPayment ? formatCurrency(monthlyPayment) : 'R$ 0,00'}
            </p>
          </div>
          
          <div>
            <p className="text-veloz-yellow font-medium text-sm md:text-base">Total a Pagar</p>
            <p className="text-white text-xl md:text-2xl font-bold">
              {totalPayment ? formatCurrency(totalPayment) : 'R$ 0,00'}
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-xs md:text-sm text-gray-400 mt-6 text-center">
        * Simulação apenas. Sujeito à análise bancária.
      </p>
    </div>
  );
};
