
import React from 'react';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Vehicle } from '@/hooks/useVehicles';

interface VehicleTableProps {
  vehicles: Vehicle[];
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  getSortIcon: (field: string) => React.ReactNode;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicle: Vehicle) => void;
}

export const VehicleTable = ({
  vehicles,
  sortField,
  sortDirection,
  onSort,
  getSortIcon,
  onEditVehicle,
  onDeleteVehicle
}: VehicleTableProps) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => onSort('brand')}
          >
            <div className="flex items-center">
              Marca/Modelo {getSortIcon('brand')}
            </div>
          </TableHead>
          <TableHead>Ano</TableHead>
          <TableHead>Placa</TableHead>
          <TableHead>Km</TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => onSort('sale_price')}
          >
            <div className="flex items-center">
              Valor {getSortIcon('sale_price')}
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => onSort('status')}
          >
            <div className="flex items-center">
              Status {getSortIcon('status')}
            </div>
          </TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow key={vehicle.id} className="hover:bg-veloz-black">
            <TableCell className="font-medium">
              {vehicle.brand} {vehicle.model} {vehicle.version}
            </TableCell>
            <TableCell>{vehicle.year}</TableCell>
            <TableCell>{vehicle.plate}</TableCell>
            <TableCell>{vehicle.mileage.toLocaleString()}</TableCell>
            <TableCell>{formatCurrency(vehicle.sale_price)}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                vehicle.status === 'Em estoque' ? 'bg-blue-900 text-blue-200' :
                vehicle.status === 'Reservado' ? 'bg-amber-900 text-amber-200' : 
                vehicle.status === 'Vendido' ? 'bg-green-900 text-green-200' :
                'bg-purple-900 text-purple-200'
              }`}>
                {vehicle.status}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0 border-veloz-gray"
                  onClick={() => onEditVehicle(vehicle)}
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0 border-veloz-gray"
                  onClick={() => onDeleteVehicle(vehicle)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
