
import React from 'react';
import { MessageCircle, Calculator } from 'lucide-react';
import { Vehicle } from '@/hooks/useVehicles';

interface VehicleActionsProps {
  vehicle: Vehicle;
  onFinancingClick: () => void;
}

export const VehicleActions: React.FC<VehicleActionsProps> = ({ vehicle, onFinancingClick }) => {
  return (
    <div className="flex gap-4 mb-6">
      <a 
        href={`https://wa.me/5511999999999?text=Olá! Estou interessado no veículo ${vehicle.brand} ${vehicle.model} ${vehicle.year} (${vehicle.id})`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="btn-primary flex-1 text-lg py-3 justify-center"
      >
        <MessageCircle size={20} />
        Tenho interesse
      </a>
      
      <button 
        onClick={onFinancingClick} 
        className="btn-secondary flex-1 text-lg py-3 justify-center"
      >
        <Calculator size={20} />
        Simular Financiamento
      </button>
    </div>
  );
};
