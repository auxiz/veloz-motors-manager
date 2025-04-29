
import React, { useState } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { useSales } from '@/hooks/useSales';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface InventoryReportsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function InventoryReports({ dateRange }: InventoryReportsProps) {
  const { vehicles } = useVehicles();
  const { sales } = useSales();
  
  const [daysThreshold, setDaysThreshold] = useState<'60' | '90' | '120'>('60');
  
  // Calculate days in stock for each vehicle
  const vehiclesWithDaysInStock = vehicles.map(vehicle => {
    const entryDate = new Date(vehicle.entry_date);
    const sale = sales.find(s => s.vehicle_id === vehicle.id);
    
    let daysInStock: number;
    let status = vehicle.status;
    
    if (sale) {
      const saleDate = new Date(sale.sale_date);
      daysInStock = differenceInDays(saleDate, entryDate);
    } else {
      daysInStock = differenceInDays(new Date(), entryDate);
    }
    
    return {
      ...vehicle,
      daysInStock,
      sale
    };
  });
  
  // Get vehicles in stock for more than threshold days
  const oldInventory = vehiclesWithDaysInStock
    .filter(v => v.status === 'in_stock' && v.daysInStock > parseInt(daysThreshold))
    .sort((a, b) => b.daysInStock - a.daysInStock);
  
  // Get vehicles with fastest sales (lowest days in stock and sold)
  const fastestSales = vehiclesWithDaysInStock
    .filter(v => v.status === 'sold')
    .sort((a, b) => a.daysInStock - b.daysInStock)
    .slice(0, 10);
  
  // Calculate average days in stock
  const soldVehicles = vehiclesWithDaysInStock.filter(v => v.status === 'sold');
  const averageDaysInStock = soldVehicles.length > 0
    ? soldVehicles.reduce((sum, v) => sum + v.daysInStock, 0) / soldVehicles.length
    : 0;
  
  // Prepare data for inventory age distribution chart
  const inventoryAgeGroups = [
    { name: '0-30 dias', value: 0 },
    { name: '31-60 dias', value: 0 },
    { name: '61-90 dias', value: 0 },
    { name: '91+ dias', value: 0 }
  ];
  
  vehiclesWithDaysInStock.filter(v => v.status === 'in_stock').forEach(vehicle => {
    if (vehicle.daysInStock <= 30) {
      inventoryAgeGroups[0].value++;
    } else if (vehicle.daysInStock <= 60) {
      inventoryAgeGroups[1].value++;
    } else if (vehicle.daysInStock <= 90) {
      inventoryAgeGroups[2].value++;
    } else {
      inventoryAgeGroups[3].value++;
    }
  });
  
  // Colors for the pie chart
  const COLORS = ['#4ade80', '#facc15', '#fb923c', '#f87171'];

  // Chart config
  const chartConfig = {
    value: { label: 'Quantidade' },
  };
  
  // Download as CSV
  const downloadCSV = (data: any[], filename: string) => {
    const headers = ['Marca', 'Modelo', 'Ano', 'Dias em Estoque', 'Preço de Venda'];
    
    const rows = data.map(vehicle => [
      vehicle.brand,
      vehicle.model,
      vehicle.year,
      vehicle.daysInStock,
      vehicle.sale_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    ]);
    
    let csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tempo Médio em Estoque</CardTitle>
            <CardDescription>Veículos vendidos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Math.round(averageDaysInStock)} dias</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Veículos em Estoque</CardTitle>
            <CardDescription>Total atual</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {vehicles.filter(v => v.status === 'in_stock').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Veículos Antigos</CardTitle>
            <CardDescription>Mais de {daysThreshold} dias</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{oldInventory.length}</p>
          </CardContent>
          <CardFooter>
            <Select value={daysThreshold} onValueChange={(value: '60' | '90' | '120') => setDaysThreshold(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Dias em estoque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60+ dias</SelectItem>
                <SelectItem value="90">90+ dias</SelectItem>
                <SelectItem value="120">120+ dias</SelectItem>
              </SelectContent>
            </Select>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Idade do Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <PieChart>
                  <Pie
                    data={inventoryAgeGroups}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {inventoryAgeGroups.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Vendas Mais Rápidas</CardTitle>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => downloadCSV(fastestSales, 'vendas-rapidas')}
                >
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
                  <TableHead>Veículo</TableHead>
                  <TableHead>Dias em Estoque</TableHead>
                  <TableHead className="text-right">Preço de Venda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fastestSales.length > 0 ? (
                  fastestSales.slice(0, 5).map(vehicle => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">
                        {vehicle.brand} {vehicle.model} {vehicle.year}
                      </TableCell>
                      <TableCell>{vehicle.daysInStock} dias</TableCell>
                      <TableCell className="text-right">
                        {Number(vehicle.sale_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Nenhum veículo vendido encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Veículos há mais de {daysThreshold} dias em estoque</CardTitle>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => downloadCSV(oldInventory, `estoque-antigo-${daysThreshold}-dias`)}
              >
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
                <TableHead>Veículo</TableHead>
                <TableHead>Data de Entrada</TableHead>
                <TableHead>Dias em Estoque</TableHead>
                <TableHead className="text-right">Preço de Venda</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {oldInventory.length > 0 ? (
                oldInventory.map(vehicle => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {vehicle.brand} {vehicle.model} {vehicle.year}
                    </TableCell>
                    <TableCell>{format(new Date(vehicle.entry_date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{vehicle.daysInStock} dias</TableCell>
                    <TableCell className="text-right">
                      {Number(vehicle.sale_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum veículo com mais de {daysThreshold} dias em estoque.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
