
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { useUsers } from '@/hooks/useUsers';
import { DummyDataGenerator } from '@/components/shared/DummyDataGenerator';

interface SalesFilterProps {
  onFilterChange: (filters: {
    startDate: Date | null;
    endDate: Date | null;
    sellerName: string;
    status: string;
    search: string;
  }) => void;
}

export const SalesFilter = ({ onFilterChange }: SalesFilterProps) => {
  const { users } = useUsers();
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(new Date().setDate(1)), // First day of current month
    to: new Date(),
  });
  const [sellerName, setSellerName] = useState('');
  const [status, setStatus] = useState('');
  
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
    onFilterChange({
      startDate: range.from || null,
      endDate: range.to || null,
      sellerName,
      status,
      search
    });
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({
      startDate: dateRange.from || null,
      endDate: dateRange.to || null,
      sellerName,
      status,
      search: e.target.value
    });
  };
  
  const handleSellerChange = (value: string) => {
    setSellerName(value);
    onFilterChange({
      startDate: dateRange.from || null,
      endDate: dateRange.to || null,
      sellerName: value,
      status,
      search
    });
  };
  
  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({
      startDate: dateRange.from || null,
      endDate: dateRange.to || null,
      sellerName,
      status: value,
      search
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vendas..."
              value={search}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
        
        <div className="w-full md:w-1/6">
          <Select value={sellerName} onValueChange={handleSellerChange}>
            <SelectTrigger>
              <SelectValue placeholder="Vendedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.name}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/6">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="canceled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="default" size="icon">
            <Filter size={16} />
          </Button>
          
          <DummyDataGenerator type="sale" />
        </div>
      </div>
    </div>
  );
}
