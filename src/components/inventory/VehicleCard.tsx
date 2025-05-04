
import React from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Vehicle } from '@/hooks/useVehicles';
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicle: Vehicle) => void;
}

export const VehicleCard = ({ vehicle, onEditVehicle, onDeleteVehicle }: VehicleCardProps) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-blue-900 text-blue-200 hover:bg-blue-900">Em estoque</Badge>;
      case 'reserved':
        return <Badge className="bg-amber-900 text-amber-200 hover:bg-amber-900">Reservado</Badge>;
      case 'sold':
        return <Badge className="bg-green-900 text-green-200 hover:bg-green-900">Vendido</Badge>;
      default:
        return <Badge className="bg-purple-900 text-purple-200 hover:bg-purple-900">{status}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden bg-veloz-gray border-veloz-gray card-hover h-full flex flex-col">
      <div className="h-48 overflow-hidden relative">
        {vehicle.photos && vehicle.photos.length > 0 ? (
          <img 
            src={vehicle.photos[0]} 
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
            Sem Imagem
          </div>
        )}
        <div className="absolute top-0 right-0 m-2">
          {getStatusBadge(vehicle.status)}
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="max-w-[70%]">
            <h3 className="font-bold text-lg truncate">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{vehicle.version} • {vehicle.year}</p>
          </div>
          <p className="text-lg font-semibold text-veloz-yellow whitespace-nowrap">
            {formatCurrency(vehicle.sale_price)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mt-4">
          <div className="flex items-center">
            <span className="text-muted-foreground mr-1">Placa:</span>
            <span className="truncate">{vehicle.plate}</span>
          </div>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-1">Km:</span>
            <span>{vehicle.mileage.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-1">Câmbio:</span>
            <span className="truncate">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-1">Combustível:</span>
            <span className="truncate">{vehicle.fuel}</span>
          </div>
        </div>
        
        <div className="border-t border-veloz-black mt-4 pt-4 flex justify-between mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-veloz-yellow text-veloz-yellow hover:bg-veloz-yellow hover:text-veloz-black"
            onClick={() => onEditVehicle(vehicle)}
          >
            <Edit size={16} className="mr-2" /> Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-veloz-gray text-veloz-white"
            onClick={() => onDeleteVehicle(vehicle)}
          >
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
