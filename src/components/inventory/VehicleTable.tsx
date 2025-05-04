
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
import { Badge } from "@/components/ui/badge";

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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer w-[30%]" 
              onClick={() => onSort('brand')}
            >
              <div className="flex items-center">
                Marca/Modelo {getSortIcon('brand')}
              </div>
            </TableHead>
            <TableHead className="w-[10%]">Ano</TableHead>
            <TableHead className="w-[10%]">Placa</TableHead>
            <TableHead className="w-[10%]">Km</TableHead>
            <TableHead 
              className="cursor-pointer w-[15%]"
              onClick={() => onSort('sale_price')}
            >
              <div className="flex items-center">
                Valor {getSortIcon('sale_price')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer w-[15%]"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center">
                Status {getSortIcon('status')}
              </div>
            </TableHead>
            <TableHead className="w-[10%] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} className="hover:bg-veloz-black">
              <TableCell className="font-medium truncate max-w-[250px]">
                <span className="block truncate">{vehicle.brand} {vehicle.model} {vehicle.version}</span>
              </TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell>{vehicle.plate}</TableCell>
              <TableCell>{vehicle.mileage.toLocaleString()}</TableCell>
              <TableCell>{formatCurrency(vehicle.sale_price)}</TableCell>
              <TableCell>
                {getStatusBadge(vehicle.status)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
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
    </div>
  );
};
