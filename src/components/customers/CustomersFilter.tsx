
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { CUSTOMER_SEGMENTS } from '@/types/customer';

interface CustomersFilterProps {
  onFilterChange: (filters: {
    search: string;
    segment: string;
    status: string;
  }) => void;
}

export const CustomersFilter: React.FC<CustomersFilterProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState<string>('');
  const [segment, setSegment] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const handleFilterApply = () => {
    onFilterChange({
      search,
      segment,
      status
    });
  };

  const handleReset = () => {
    setSearch('');
    setSegment('all');
    setStatus('all');
    
    onFilterChange({
      search: '',
      segment: 'all',
      status: 'all'
    });
  };

  // Group segments by type for better organization
  const behaviorSegments = CUSTOMER_SEGMENTS.filter(s => s.type === 'behavior');
  const preferenceSegments = CUSTOMER_SEGMENTS.filter(s => s.type === 'preference');
  const statusSegments = CUSTOMER_SEGMENTS.filter(s => s.type === 'status');

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/4">
          <Input 
            placeholder="Pesquisar por nome, CPF/CNPJ, email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
            prefix={<Search size={16} />}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-2/4">
          <Select value={segment} onValueChange={setSegment}>
            <SelectTrigger>
              <SelectValue placeholder="Segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Segmentos</SelectItem>
              
              <SelectItem value="behavior" disabled className="font-semibold text-veloz-yellow">
                Comportamento
              </SelectItem>
              {behaviorSegments.map((segment) => (
                <SelectItem key={segment.id} value={segment.id}>
                  {segment.label}
                </SelectItem>
              ))}
              
              <SelectItem value="preference" disabled className="font-semibold text-veloz-yellow">
                Preferências
              </SelectItem>
              {preferenceSegments.map((segment) => (
                <SelectItem key={segment.id} value={segment.id}>
                  {segment.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="active">Cliente Ativo</SelectItem>
              <SelectItem value="inactive">Cliente Inativo</SelectItem>
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
