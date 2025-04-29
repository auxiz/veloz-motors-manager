
import React, { useState } from 'react';
import { useSales } from '@/hooks/useSales';
import { useUsers } from '@/hooks/useUsers';
import { useVehicles } from '@/hooks/useVehicles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { format, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface SalesPerformanceReportsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function SalesPerformanceReports({ dateRange }: SalesPerformanceReportsProps) {
  const { sales } = useSales();
  const { users } = useUsers();
  const { vehicles } = useVehicles();
  
  // Filter sales by date range
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    return isWithinInterval(saleDate, {
      start: dateRange.from,
      end: dateRange.to
    });
  });
  
  // Calculate sales performance by user
  const salesByUser: Record<string, {
    userId: string;
    name: string;
    salesCount: number;
    totalSales: number;
    totalCommission: number;
    averageValue: number;
  }> = {};
  
  filteredSales.forEach(sale => {
    const { seller_id, final_price, commission_amount } = sale;
    const user = users.find(u => u.id === seller_id);
    
    if (!user) return;
    
    if (!salesByUser[seller_id]) {
      salesByUser[seller_id] = {
        userId: seller_id,
        name: user.name,
        salesCount: 0,
        totalSales: 0,
        totalCommission: 0,
        averageValue: 0
      };
    }
    
    salesByUser[seller_id].salesCount += 1;
    salesByUser[seller_id].totalSales += Number(final_price);
    salesByUser[seller_id].totalCommission += Number(commission_amount);
  });
  
  // Calculate average sale value for each user
  Object.keys(salesByUser).forEach(userId => {
    const { salesCount, totalSales } = salesByUser[userId];
    salesByUser[userId].averageValue = salesCount > 0 ? totalSales / salesCount : 0;
  });
  
  // Convert to array for sorting and rendering
  const performanceData = Object.values(salesByUser)
    .sort((a, b) => b.totalSales - a.totalSales);
  
  // Prepare chart data
  const chartData = performanceData.map(user => ({
    name: user.name,
    sales: user.totalSales,
    commission: user.totalCommission,
    count: user.salesCount
  }));

  // Calculate total sales and commissions
  const totalSalesAmount = performanceData.reduce((total, user) => total + user.totalSales, 0);
  const totalCommissions = performanceData.reduce((total, user) => total + user.totalCommission, 0);
  const totalSalesCount = performanceData.reduce((total, user) => total + user.salesCount, 0);

  // Chart config
  const chartConfig = {
    sales: { label: 'Total de Vendas (R$)' },
    commission: { label: 'Total de Comissões (R$)' },
    count: { label: 'Quantidade de Vendas' },
  };
  
  // Download as CSV
  const downloadCSV = () => {
    const headers = ['Vendedor', 'Vendas', 'Valor Total', 'Comissões', 'Valor Médio'];
    
    const rows = performanceData.map(user => [
      user.name,
      user.salesCount,
      user.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      user.totalCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      user.averageValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    ]);
    
    let csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `desempenho-vendedores-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Vendedores</CardTitle>
            <CardDescription>Com vendas no período</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{performanceData.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Vendas</CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalSalesAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Comissões</CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalCommissions.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Desempenho de Vendas por Vendedor</CardTitle>
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
          <div className="h-[400px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="sales" name="Valor Total (R$)" fill="#4ade80" />
                <Bar dataKey="commission" name="Comissões (R$)" fill="#facc15" />
                <Bar dataKey="count" name="Número de Vendas" fill="#60a5fa" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ranking de Vendedores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead className="text-right">Qtd. Vendas</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">Comissões</TableHead>
                <TableHead className="text-right">Valor Médio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData.length > 0 ? (
                performanceData.map((user, index) => (
                  <TableRow key={user.userId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-right">{user.salesCount}</TableCell>
                    <TableCell className="text-right">
                      {user.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.totalCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.averageValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhum dado de vendedor encontrado no período selecionado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento de Vendas por Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendedor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Comissão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => {
                  const seller = users.find(user => user.id === sale.seller_id);
                  const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
                  
                  return (
                    <TableRow key={sale.id}>
                      <TableCell>{seller?.name || 'N/A'}</TableCell>
                      <TableCell>{format(new Date(sale.sale_date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'N/A'}
                      </TableCell>
                      <TableCell>{sale.customer?.name || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        {Number(sale.final_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(sale.commission_amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhuma venda encontrada no período selecionado.
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
