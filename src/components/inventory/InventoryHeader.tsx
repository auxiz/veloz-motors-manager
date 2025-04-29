
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, GridIcon, LayoutList } from 'lucide-react';
import { DummyDataGenerator } from '@/components/shared/DummyDataGenerator';

interface InventoryHeaderProps {
  onViewChange: (view: 'lista' | 'cards') => void;
  currentView: 'lista' | 'cards';
  onNewVehicle: () => void;
}

export function InventoryHeader({ onViewChange, currentView, onNewVehicle }: InventoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Controle de Estoque</h1>
        <p className="text-muted-foreground">Gerencie os veículos disponíveis para venda</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="inline-flex items-center rounded-md bg-veloz-black p-1 mr-2">
          <Button
            variant={currentView === 'lista' ? 'default' : 'ghost'}
            size="sm"
            className={currentView === 'lista' ? 'bg-veloz-yellow text-veloz-black' : 'text-veloz-white'}
            onClick={() => onViewChange('lista')}
          >
            <LayoutList size={18} className="mr-1" />
            Lista
          </Button>
          <Button
            variant={currentView === 'cards' ? 'default' : 'ghost'}
            size="sm"
            className={currentView === 'cards' ? 'bg-veloz-yellow text-veloz-black' : 'text-veloz-white'}
            onClick={() => onViewChange('cards')}
          >
            <GridIcon size={18} className="mr-1" />
            Cards
          </Button>
        </div>
        
        <DummyDataGenerator type="vehicle" />
        
        <Button
          className="bg-veloz-yellow hover:bg-yellow-500 text-black font-bold"
          onClick={onNewVehicle}
        >
          <Car size={18} className="mr-2" />
          Novo Veículo
        </Button>
      </div>
    </div>
  );
}
