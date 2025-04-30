
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Transaction } from '@/hooks/useTransactions';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CashFlowChartProps {
  transactions: Transaction[];
}

export function CashFlowChart({ transactions }: CashFlowChartProps) {
  // Prepare data for chart
  const chartData = React.useMemo(() => {
    const byMonth = transactions.reduce((acc: Record<string, {month: string, income: number, expense: number}>, transaction) => {
      // Format date to month
      const date = parseISO(transaction.due_date);
      const monthKey = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMM yyyy', { locale: ptBR });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthLabel,
          income: 0,
          expense: 0,
        };
      }
      
      // Add amount to the right category
      if (transaction.type === 'income') {
        acc[monthKey].income += Number(transaction.amount);
      } else {
        acc[monthKey].expense += Number(transaction.amount);
      }
      
      return acc;
    }, {});
    
    // Convert object to array and sort by month
    return Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);
  
  // Chart config
  const chartConfig = {
    income: {
      label: 'Receitas',
      theme: {
        light: '#4ade80',
        dark: '#4ade80'
      }
    },
    expense: {
      label: 'Despesas',
      theme: {
        light: '#f87171',
        dark: '#f87171'
      }
    }
  };

  // Format large values for better readability
  const formatYAxis = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };
  
  return (
    <div className="h-[350px] w-full relative z-0 mb-4">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            barGap={10}
            barSize={16}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#999', fontSize: 12 }}
              tickLine={{ stroke: '#555' }}
              axisLine={{ stroke: '#555' }}
              height={60}
              padding={{ left: 10, right: 10 }}
              tickMargin={8}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              tick={{ fill: '#999', fontSize: 12 }}
              tickLine={{ stroke: '#555' }}
              axisLine={{ stroke: '#555' }}
              width={60}
              tickMargin={8}
            />
            <Tooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
              wrapperStyle={{ zIndex: 1000 }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ paddingBottom: '15px' }}
            />
            <Bar 
              dataKey="income" 
              name="Receitas" 
              fill="#4ade80" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="expense" 
              name="Despesas" 
              fill="#f87171" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
