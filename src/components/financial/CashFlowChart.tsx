
import React, { useState, useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  due_date: string;
  status: string;
}

interface ChartData {
  name: string;
  income: number;
  expense: number;
  balance: number;
}

interface CashFlowChartProps {
  transactions: Transaction[];
}

export const CashFlowChart = ({ transactions }: CashFlowChartProps) => {
  const [period, setPeriod] = useState<'3' | '6' | '12'>('6');

  const chartData = useMemo(() => {
    const currentDate = new Date();
    const months = parseInt(period);
    const monthsData: { [key: string]: ChartData } = {};

    // Initialize the past months with zero values
    for (let i = 0; i < months; i++) {
      const date = subMonths(currentDate, i);
      const monthKey = format(date, 'yyyy-MM');
      const monthName = format(date, 'MMM', { locale: ptBR });
      
      monthsData[monthKey] = {
        name: monthName,
        income: 0,
        expense: 0,
        balance: 0
      };
    }

    // Calculate data for each month
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.due_date);
      const monthKey = format(transactionDate, 'yyyy-MM');
      
      // Only include transactions for the months we're displaying
      if (monthsData[monthKey]) {
        const amount = Number(transaction.amount);
        
        if (transaction.type === 'income') {
          monthsData[monthKey].income += amount;
        } else if (transaction.type === 'expense') {
          monthsData[monthKey].expense += amount;
        }
      }
    });

    // Calculate balance for each month
    Object.keys(monthsData).forEach(key => {
      monthsData[key].balance = monthsData[key].income - monthsData[key].expense;
    });

    // Convert to array and sort by date (oldest first)
    return Object.values(monthsData).reverse();
  }, [transactions, period]);

  const chartConfig = {
    income: { label: 'Receitas' },
    expense: { label: 'Despesas' },
    balance: { label: 'Saldo' },
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={period} onValueChange={(value) => setPeriod(value as '3' | '6' | '12')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="12">Últimos 12 meses</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="income" name="Receitas" fill="#4ade80" />
            <Bar dataKey="expense" name="Despesas" fill="#f87171" />
            <Bar dataKey="balance" name="Saldo" fill="#facc15" />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
