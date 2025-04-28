
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface InventoryHeaderProps {
  onViewChange: (view: 'lista' | 'cards') => void;
  currentView: 'lista' | 'cards';
  onNewVehicle: () => void;
}

export const InventoryHeader = ({
  onViewChange,
  currentView,
  onNewVehicle,
}: InventoryHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Estoque de Veículos</h1>
        <p className="text-muted-foreground">Gerencie seu inventário de veículos</p>
      </div>
      
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className={`px-3 ${currentView === 'lista' ? 'bg-veloz-yellow text-veloz-black' : 'border-veloz-gray text-veloz-white'}`} 
          onClick={() => onViewChange('lista')}
        >
          Lista
        </Button>
        <Button 
          variant="outline" 
          className={`px-3 ${currentView === 'cards' ? 'bg-veloz-yellow text-veloz-black' : 'border-veloz-gray text-veloz-white'}`} 
          onClick={() => onViewChange('cards')}
        >
          Cards
        </Button>
        <Button 
          className="bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
          onClick={onNewVehicle}
        >
          <Plus size={18} className="mr-2" /> Novo Veículo
        </Button>
      </div>
    </div>
  );
};
