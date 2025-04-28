
import React from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string | null;
  year: number;
  plate: string | null;
  mileage: number;
  transmission: string;
  fuel: string;
  sale_price: number;
  status: string;
  photos: string[] | null;
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  return (
    <Card className="overflow-hidden bg-veloz-gray border-veloz-gray card-hover">
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
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            vehicle.status === 'Em estoque' ? 'bg-blue-900 text-blue-200' :
            vehicle.status === 'Reservado' ? 'bg-amber-900 text-amber-200' : 
            vehicle.status === 'Vendido' ? 'bg-green-900 text-green-200' :
            'bg-purple-900 text-purple-200'
          }`}>
            {vehicle.status}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.version} • {vehicle.year}</p>
          </div>
          <p className="text-lg font-semibold text-veloz-yellow">
            {formatCurrency(vehicle.sale_price)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mt-4">
          <div className="flex items-center">
            <span className="text-muted-foreground mr-1">Placa:</span>
            <span>{vehicle.plate}</span>
          </div>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-1">Km:</span>
            <span>{vehicle.mileage.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-1">Câmbio:</span>
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-1">Combustível:</span>
            <span>{vehicle.fuel}</span>
          </div>
        </div>
        
        <div className="border-t border-veloz-black mt-4 pt-4 flex justify-between">
          <Button variant="outline" size="sm" className="border-veloz-yellow text-veloz-yellow hover:bg-veloz-yellow hover:text-veloz-black">
            <Edit size={16} className="mr-2" /> Editar
          </Button>
          <Button variant="outline" size="sm" className="border-veloz-gray text-veloz-white">
            Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
