
import React, { useState } from 'react';
import { useVehicles, Vehicle } from '@/hooks/useVehicles';
import { Card } from '@/components/ui/card';
import { Car, ChevronDown, ChevronUp } from 'lucide-react';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';
import { InventorySearch } from '@/components/inventory/InventorySearch';
import { VehicleCard } from '@/components/inventory/VehicleCard';
import { VehicleTable } from '@/components/inventory/VehicleTable';
import { NewVehicleDialog } from '@/components/inventory/NewVehicleDialog';
import { EditVehicleDialog } from '@/components/inventory/EditVehicleDialog';
import { DeleteVehicleDialog } from '@/components/inventory/DeleteVehicleDialog';
import { AuthGuard } from '@/components/auth/AuthGuard';

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visualizacao, setVisualizacao] = useState<'lista' | 'cards'>('lista');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [novoVeiculoDialogOpen, setNovoVeiculoDialogOpen] = useState(false);
  const [editVehicleDialogOpen, setEditVehicleDialogOpen] = useState(false);
  const [deleteVehicleDialogOpen, setDeleteVehicleDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  const { vehicles, isLoading, deleteVehicle } = useVehicles();

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

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setEditVehicleDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteVehicleDialogOpen(true);
  };

  const confirmDeleteVehicle = async () => {
    if (!selectedVehicle) return;
    
    try {
      await deleteVehicle.mutateAsync(selectedVehicle.id);
      setDeleteVehicleDialogOpen(false);
      setSelectedVehicle(null);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
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
    <AuthGuard allowedRoles={['administrator', 'seller', 'dispatcher']}>
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
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVeiculos.map((vehicle) => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onEditVehicle={handleEditVehicle}
                onDeleteVehicle={handleDeleteVehicle}
              />
            ))}
          </div>
        )}
        
        <NewVehicleDialog 
          open={novoVeiculoDialogOpen}
          onOpenChange={setNovoVeiculoDialogOpen}
        />

        <EditVehicleDialog 
          open={editVehicleDialogOpen}
          onOpenChange={setEditVehicleDialogOpen}
          vehicle={selectedVehicle}
        />

        <DeleteVehicleDialog 
          open={deleteVehicleDialogOpen}
          onOpenChange={setDeleteVehicleDialogOpen}
          onConfirm={confirmDeleteVehicle}
          vehicleName={selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : ''}
        />
      </div>
    </AuthGuard>
  );
};

export default Estoque;
