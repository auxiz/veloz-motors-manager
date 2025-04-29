
import React, { useState } from 'react';
import { useSales } from '@/hooks/useSales';
import { useVehicles } from '@/hooks/useVehicles';
import { useUsers } from '@/hooks/useUsers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { format, subDays, subWeeks, subMonths, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface SalesReportsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function SalesReports({ dateRange }: SalesReportsProps) {
  const { sales, isLoading: isLoadingSales } = useSales();
  const { vehicles } = useVehicles();
  const { users } = useUsers();
  
  const [periodType, setPeriodType] = useState<'day' | 'week' | 'month'>('month');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSeller, setSelectedSeller] = useState<string>('all');

  // Get unique brands from vehicles
  const brands = [...new Set(vehicles.map(vehicle => vehicle.brand))];
  
  // Filter sales by date range and other filters
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    
    // Date range filter
    const inDateRange = isWithinInterval(saleDate, {
      start: dateRange.from,
      end: dateRange.to
    });
    
    // Brand filter
    const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
    const matchesBrand = selectedBrand === 'all' || (vehicle && vehicle.brand === selectedBrand);
    
    // Seller filter
    const matchesSeller = selectedSeller === 'all' || sale.seller_id === selectedSeller;
    
    return inDateRange && matchesBrand && matchesSeller;
  });

  // Generate chart data based on period type
  const chartData = React.useMemo(() => {
    const data: { name: string; value: number; amount: number }[] = [];
    
    // Function to get the period key based on date
    const getPeriodKey = (date: Date) => {
      switch (periodType) {
        case 'day':
          return format(date, 'dd/MM/yyyy', { locale: ptBR });
        case 'week':
          return `Semana ${format(date, 'w', { locale: ptBR })}, ${format(date, 'yyyy')}`;
        case 'month':
          return format(date, 'MMM yyyy', { locale: ptBR });
        default:
          return '';
      }
    };
    
    // Group sales by period
    const salesByPeriod: Record<string, { count: number; amount: number }> = {};
    
    filteredSales.forEach(sale => {
      const saleDate = new Date(sale.sale_date);
      const periodKey = getPeriodKey(saleDate);
      
      if (!salesByPeriod[periodKey]) {
        salesByPeriod[periodKey] = { count: 0, amount: 0 };
      }
      
      salesByPeriod[periodKey].count += 1;
      salesByPeriod[periodKey].amount += Number(sale.final_price);
    });
    
    // Convert to chart data format
    Object.entries(salesByPeriod).forEach(([key, value]) => {
      data.push({
        name: key,
        value: value.count,
        amount: value.amount
      });
    });
    
    return data;
  }, [filteredSales, periodType]);

  // Calculate total sales and amount
  const totalSales = filteredSales.length;
  const totalAmount = filteredSales.reduce((sum, sale) => sum + Number(sale.final_price), 0);

  // Download as CSV
  const downloadCSV = () => {
    const headers = ['Data', 'Veículo', 'Vendedor', 'Cliente', 'Valor'];
    
    const rows = filteredSales.map(sale => {
      const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
      const seller = users.find(user => user.id === sale.seller_id);
      
      return [
        format(new Date(sale.sale_date), 'dd/MM/yyyy'),
        vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 'N/A',
        seller ? seller.name : 'N/A',
        sale.customer?.name || 'N/A',
        sale.final_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      ];
    });
    
    let csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-vendas-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (isLoadingSales) {
    return <div>Carregando dados de vendas...</div>;
  }

  const chartConfig = {
    value: { label: 'Qtd. de Veículos' },
    amount: { label: 'Valor Total (R$)' },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Vendas</CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalSales}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Valor Total</CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Média por Venda</CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalSales > 0
                ? (totalAmount / totalSales).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'R$ 0,00'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Vendas por Período</CardTitle>
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" name="Quantidade" fill="#4ade80" />
                <Bar dataKey="amount" name="Valor (R$)" fill="#f87171" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Detalhamento de Vendas</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={downloadCSV}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map(sale => {
                  const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
                  const seller = users.find(user => user.id === sale.seller_id);
                  
                  return (
                    <TableRow key={sale.id}>
                      <TableCell>{format(new Date(sale.sale_date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        {vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 'N/A'}
                      </TableCell>
                      <TableCell>{seller ? seller.name : 'N/A'}</TableCell>
                      <TableCell>{sale.customer?.name || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        {Number(sale.final_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhuma venda encontrada para o período e filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredSales.length} de {sales.length} vendas
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
