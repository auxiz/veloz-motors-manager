
import React from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

interface FinancialReportsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function FinancialReports({ dateRange }: FinancialReportsProps) {
  const { transactions } = useTransactions();
  
  // Filter transactions by date range
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.due_date);
    return isWithinInterval(transactionDate, {
      start: dateRange.from,
      end: dateRange.to
    });
  });
  
  // Calculate totals
  const totalRevenue = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const profit = totalRevenue - totalExpenses;
  
  // Group data by categories for expenses pie chart
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Number(amount);
      return acc;
    }, {});
  
  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));
  
  // Group data by month for financial overview chart
  const financialByMonth: Record<string, { month: string; revenue: number; expenses: number; profit: number }> = {};
  
  filteredTransactions.forEach(transaction => {
    const date = new Date(transaction.due_date);
    const monthKey = format(date, 'yyyy-MM');
    const monthLabel = format(date, 'MMM yyyy', { locale: ptBR });
    
    if (!financialByMonth[monthKey]) {
      financialByMonth[monthKey] = {
        month: monthLabel,
        revenue: 0,
        expenses: 0,
        profit: 0
      };
    }
    
    if (transaction.type === 'income') {
      financialByMonth[monthKey].revenue += Number(transaction.amount);
    } else {
      financialByMonth[monthKey].expenses += Number(transaction.amount);
    }
  });
  
  // Calculate profit for each month
  Object.keys(financialByMonth).forEach(key => {
    financialByMonth[key].profit = financialByMonth[key].revenue - financialByMonth[key].expenses;
  });
  
  const monthlyData = Object.values(financialByMonth).sort((a, b) => 
    new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  // Chart configuration
  const chartConfig = {
    revenue: { label: 'Receitas' },
    expenses: { label: 'Despesas' },
    profit: { label: 'Lucro' },
  };
  
  // Download as CSV
  const downloadCSV = () => {
    const headers = ['Mês', 'Receitas', 'Despesas', 'Lucro'];
    
    const rows = monthlyData.map(data => [
      data.month,
      data.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      data.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      data.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    ]);
    
    let csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Receitas Totais</CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">
              {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Despesas Totais</CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">
              {totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Lucro Total</CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Visão Geral Financeira</CardTitle>
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
        <Separator className="bg-border/50" />
        <CardContent className="pt-6">
          <div className="h-[400px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="revenue" name="Receitas" fill="#4ade80" />
                <Bar dataKey="expenses" name="Despesas" fill="#f87171" />
                <Line type="monotone" dataKey="profit" name="Lucro" stroke="#facc15" strokeWidth={2} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Details Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <Separator className="bg-border/50" />
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">% do Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData.length > 0 ? (
                  categoryData
                    .sort((a, b) => b.value - a.value)
                    .map((category) => (
                      <TableRow key={category.name}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">
                          {category.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell className="text-right">
                          {((category.value / totalExpenses) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Nenhuma despesa encontrada no período selecionado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Monthly Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Mensal</CardTitle>
          </CardHeader>
          <Separator className="bg-border/50" />
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead className="text-right">Receitas</TableHead>
                  <TableHead className="text-right">Despesas</TableHead>
                  <TableHead className="text-right">Lucro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyData.length > 0 ? (
                  monthlyData.map((data) => (
                    <TableRow key={data.month}>
                      <TableCell className="font-medium">{data.month}</TableCell>
                      <TableCell className="text-right text-green-500">
                        {data.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell className="text-right text-red-500">
                        {data.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell className={`text-right ${data.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Nenhum dado financeiro encontrado no período selecionado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
