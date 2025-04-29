
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { DummyDataGenerator } from '@/components/shared/DummyDataGenerator';

interface TransactionsFilterProps {
  onFilterChange: (filters: {
    startDate: Date | null;
    endDate: Date | null;
    category: string;
    status: string;
    search: string;
  }) => void;
}

export const TransactionsFilter = ({ onFilterChange }: TransactionsFilterProps) => {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    onFilterChange({
      startDate: range.from || null,
      endDate: range.to || null,
      category,
      status,
      search
    });
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({
      startDate: dateRange.from || null,
      endDate: dateRange.to || null,
      category,
      status,
      search: e.target.value
    });
  };
  
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({
      startDate: dateRange.from || null,
      endDate: dateRange.to || null,
      category: value,
      status,
      search
    });
  };
  
  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({
      startDate: dateRange.from || null,
      endDate: dateRange.to || null,
      category,
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
              placeholder="Buscar transações..."
              value={search}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          <DateRangePicker 
            date={dateRange} 
            onDateChange={handleDateRangeChange}
          />
        </div>
        
        <div className="w-full md:w-1/6">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="venda">Venda</SelectItem>
              <SelectItem value="financiamento">Financiamento</SelectItem>
              <SelectItem value="comissão">Comissão</SelectItem>
              <SelectItem value="aluguel">Aluguel</SelectItem>
              <SelectItem value="salários">Salários</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
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
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="default" size="icon">
            <Filter size={16} />
          </Button>
          
          <DummyDataGenerator type="transaction" />
        </div>
      </div>
    </div>
  );
}
