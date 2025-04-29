
import React, { useState } from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Search, X } from 'lucide-react';

interface TransactionsFilterProps {
  onFilterChange: (filters: {
    startDate: Date | null;
    endDate: Date | null;
    category: string;
    status: string;
    search: string;
  }) => void;
}

const CATEGORIES = [
  'venda',
  'imposto',
  'manutenção',
  'salário',
  'aluguel',
  'marketing',
  'outros'
];

export const TransactionsFilter = ({ onFilterChange }: TransactionsFilterProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const applyFilters = () => {
    onFilterChange({
      startDate,
      endDate,
      category,
      status,
      search,
    });
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setCategory('');
    setStatus('');
    setSearch('');
    onFilterChange({
      startDate: null,
      endDate: null,
      category: '',
      status: '',
      search: '',
    });
  };

  return (
    <Card className="bg-veloz-black border-veloz-gray">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Data inicial</label>
            <DatePicker 
              selected={startDate} 
              onSelect={setStartDate} 
              placeholder="Data inicial"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Data final</label>
            <DatePicker 
              selected={endDate} 
              onSelect={setEndDate} 
              placeholder="Data final"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Categoria</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Busca</label>
            <div className="flex">
              <Input 
                placeholder="Buscar transação..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-r-none"
              />
              <Button 
                onClick={applyFilters}
                className="rounded-l-none bg-veloz-yellow hover:bg-yellow-500 text-black"
              >
                <Search size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <Button variant="outline" onClick={resetFilters} size="sm">
            <X size={16} className="mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
