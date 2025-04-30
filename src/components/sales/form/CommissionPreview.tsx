
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { UseFormWatch } from 'react-hook-form';
import { SaleFormValues } from './FormSchema';

interface CommissionPreviewProps {
  selectedVehicle: any;
  watch: UseFormWatch<SaleFormValues>;
}

export const CommissionPreview: React.FC<CommissionPreviewProps> = ({ selectedVehicle, watch }) => {
  if (!selectedVehicle) return null;
  
  return (
    <div className="p-4 bg-veloz-black rounded-md">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Valor da Venda:</span>
        <span className="text-veloz-yellow font-semibold">
          {formatCurrency(watch('finalPrice'))}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm mt-1">
        <span className="text-gray-400">Comissão Estimada:</span>
        <span className="text-veloz-yellow font-semibold">
          {formatCurrency(
            watch('commissionType') === 'fixed'
              ? watch('commissionValue')
              : (watch('finalPrice') * watch('commissionValue')) / 100
          )}
        </span>
      </div>
    </div>
  );
};
