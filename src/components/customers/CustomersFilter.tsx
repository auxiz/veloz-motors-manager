
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Filter } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CUSTOMER_SEGMENTS } from '@/types/customer';
import { DummyDataGenerator } from '@/components/shared/DummyDataGenerator';

interface CustomersFilterProps {
  onFilterChange: (filters: {
    search: string;
    segment: string;
    status: string;
  }) => void;
}

export function CustomersFilter({ onFilterChange }: CustomersFilterProps) {
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('all');
  const [status, setStatus] = useState('all');
  
  useEffect(() => {
    onFilterChange({
      search,
      segment,
      status,
    });
  }, [search, segment, status, onFilterChange]);
  
  // Group segments by type
  const groupedSegments = CUSTOMER_SEGMENTS.reduce((groups, item) => {
    groups[item.type] = [...(groups[item.type] || []), item];
    return groups;
  }, {} as Record<string, typeof CUSTOMER_SEGMENTS>);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, documento ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          <Select value={segment} onValueChange={setSegment}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os segmentos</SelectItem>
              
              {Object.entries(groupedSegments).map(([type, segments]) => (
                <React.Fragment key={type}>
                  <SelectItem value={`header-${type}`} disabled className="text-xs uppercase font-bold py-1">
                    {type === 'behavior' ? 'Comportamento' : 
                     type === 'preference' ? 'Preferências' : 'Status'}
                  </SelectItem>
                  {segments.map(segment => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.label}
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="lead">Leads</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="default" size="icon">
            <Filter size={16} />
          </Button>
          
          <DummyDataGenerator type="customer" />
        </div>
      </div>
    </div>
  );
}
