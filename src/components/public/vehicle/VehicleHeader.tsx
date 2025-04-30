
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface VehicleHeaderProps {
  brand: string;
  model: string;
  version?: string | null;
  price: number;
}

export const VehicleHeader: React.FC<VehicleHeaderProps> = ({ brand, model, version, price }) => {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-2 text-white">
        {brand} {model}
        {version && ` ${version}`}
      </h1>
      <div className="mb-4">
        <p className="text-veloz-yellow font-montserrat font-bold text-3xl">
          {formatCurrency(price)}
        </p>
      </div>
    </>
  );
};
