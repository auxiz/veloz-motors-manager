
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Search, X } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SalesFilterProps {
  onFilterChange: (filters: {
    startDate: Date | null;
    endDate: Date | null;
    sellerName: string;
    status: string;
    search: string;
  }) => void;
}

export const SalesFilter: React.FC<SalesFilterProps> = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sellerName, setSellerName] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const handleFilterApply = () => {
    onFilterChange({
      startDate,
      endDate,
      sellerName,
      status,
      search,
    });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSellerName('');
    setStatus('');
    setSearch('');
    
    onFilterChange({
      startDate: null,
      endDate: null,
      sellerName: '',
      status: '',
      search: '',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/5">
          <Input 
            placeholder="Pesquisar por veículo, cliente ou vendedor..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
            prefix={<Search size={16} />}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-3/5">
          <div className="flex items-center gap-2">
            <DatePicker 
              selected={startDate} 
              onSelect={setStartDate} 
              placeholder="Data inicial" 
            />
          </div>
          
          <div className="flex items-center gap-2">
            <DatePicker 
              selected={endDate} 
              onSelect={setEndDate} 
              placeholder="Data final" 
            />
          </div>
          
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="cash">À Vista</SelectItem>
              <SelectItem value="financing">Financiamento</SelectItem>
              <SelectItem value="consignment">Consignação</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={handleReset}
        >
          <X size={16} className="mr-1" /> Limpar
        </Button>
        <Button 
          onClick={handleFilterApply}
          className="bg-veloz-yellow hover:bg-yellow-500 text-black"
        >
          <Search size={16} className="mr-1" /> Aplicar
        </Button>
      </div>
    </div>
  );
};
