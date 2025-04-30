
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export const VehicleError: React.FC = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="bg-veloz-black rounded-lg p-8 text-center">
          <Car className="h-16 w-16 mx-auto text-veloz-yellow mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold text-white mb-2">Veículo não encontrado</h2>
          <p className="text-white mb-6">O veículo que você está procurando não está disponível.</p>
          <Link to="/veiculos" className="btn-primary inline-flex">
            <ArrowLeft size={18} />
            Ver outros veículos
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};
