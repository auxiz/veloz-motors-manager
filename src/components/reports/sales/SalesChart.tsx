
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface SalesChartProps {
  chartData: {
    name: string;
    value: number;
    amount: number;
  }[];
  filterBar: React.ReactNode;
}

export function SalesChart({ chartData, filterBar }: SalesChartProps) {
  const chartConfig = {
    value: { label: 'Qtd. de Veículos' },
    amount: { label: 'Valor Total (R$)' },
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Vendas por Período</CardTitle>
          {filterBar}
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
  );
}
