
import React, { useState } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { Card } from '@/components/ui/card';
import { Car, ChevronDown, ChevronUp } from 'lucide-react';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';
import { InventorySearch } from '@/components/inventory/InventorySearch';
import { VehicleCard } from '@/components/inventory/VehicleCard';
import { VehicleTable } from '@/components/inventory/VehicleTable';
import { NewVehicleDialog } from '@/components/inventory/NewVehicleDialog';

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visualizacao, setVisualizacao] = useState<'lista' | 'cards'>('lista');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [novoVeiculoDialogOpen, setNovoVeiculoDialogOpen] = useState(false);
  
  const { vehicles, isLoading } = useVehicles();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const filteredVeiculos = vehicles.filter(veiculo => 
    veiculo.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.plate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Car className="h-12 w-12 text-veloz-yellow animate-pulse" />
          <p className="text-veloz-white text-lg">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <InventoryHeader 
        onViewChange={setVisualizacao}
        currentView={visualizacao}
        onNewVehicle={() => setNovoVeiculoDialogOpen(true)}
      />
      
      <InventorySearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {visualizacao === 'lista' ? (
        <Card className="bg-veloz-gray border-veloz-gray">
          <VehicleTable 
            vehicles={filteredVeiculos}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            getSortIcon={getSortIcon}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVeiculos.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
      
      <NewVehicleDialog 
        open={novoVeiculoDialogOpen}
        onOpenChange={setNovoVeiculoDialogOpen}
      />
    </div>
  );
};

export default Estoque;
