
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InventorySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const InventorySearch = ({ searchTerm, onSearchChange }: InventorySearchProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por marca, modelo ou placa..."
            className="pl-10 bg-veloz-gray border-veloz-gray"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="col-span-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full border-veloz-gray text-veloz-white">
              <Filter size={18} className="mr-2" /> Filtrar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Todos os veículos</DropdownMenuItem>
            <DropdownMenuItem>Em estoque</DropdownMenuItem>
            <DropdownMenuItem>Reservados</DropdownMenuItem>
            <DropdownMenuItem>Vendidos</DropdownMenuItem>
            <DropdownMenuItem>Consignados</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
