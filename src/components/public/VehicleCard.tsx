
import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Vehicle } from '@/hooks/useVehicles';

interface VehicleCardProps {
  vehicle: Vehicle;
  featured?: boolean;
}

export const VehicleCard = ({ vehicle, featured }: VehicleCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Link to={`/veiculos/${vehicle.id}`}>
      <Card className={`overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg bg-veloz-gray border-veloz-gray ${featured ? 'border-veloz-yellow border-2' : ''}`}>
        <div className="relative h-48 overflow-hidden bg-veloz-black">
          {vehicle.photos && vehicle.photos.length > 0 ? (
            <img 
              src={vehicle.photos[0]} 
              alt={`${vehicle.brand} ${vehicle.model}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-veloz-black">
              <Car size={64} className="text-veloz-yellow opacity-30" />
            </div>
          )}
          {featured && (
            <div className="absolute top-0 right-0 bg-veloz-yellow text-veloz-black font-semibold px-3 py-1">
              Destaque
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-montserrat font-semibold text-lg text-white">
            {vehicle.brand} {vehicle.model}
          </h3>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-white">
              {vehicle.year} • {vehicle.mileage.toLocaleString('pt-BR')} km • {vehicle.fuel}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-veloz-yellow font-montserrat font-bold text-xl">
              {formatPrice(vehicle.sale_price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
