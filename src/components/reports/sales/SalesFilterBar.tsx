
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vehicle } from '@/hooks/useVehicles';
import { User } from '@/hooks/useUsers';

interface SalesFilterBarProps {
  periodType: 'day' | 'week' | 'month';
  setPeriodType: (value: 'day' | 'week' | 'month') => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedSeller: string;
  setSelectedSeller: (seller: string) => void;
  brands: string[];
  users: User[];
}

export function SalesFilterBar({
  periodType,
  setPeriodType,
  selectedBrand,
  setSelectedBrand,
  selectedSeller,
  setSelectedSeller,
  brands,
  users,
}: SalesFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select value={periodType} onValueChange={(value: 'day' | 'week' | 'month') => setPeriodType(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Agrupar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Dia</SelectItem>
          <SelectItem value="week">Semana</SelectItem>
          <SelectItem value="month">Mês</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por marca" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as marcas</SelectItem>
          {brands.map(brand => (
            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedSeller} onValueChange={setSelectedSeller}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por vendedor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os vendedores</SelectItem>
          {users.map(user => (
            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
