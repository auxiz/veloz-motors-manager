
import React from 'react';
import { Car } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export const VehicleLoading: React.FC = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Car className="h-12 w-12 text-veloz-yellow animate-pulse" />
            <p className="text-white text-lg">Carregando informações do veículo...</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
