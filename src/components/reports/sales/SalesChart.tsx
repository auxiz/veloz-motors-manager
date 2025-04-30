
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';

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
    <div className="space-y-4">
      <Card className="bg-veloz-gray border-veloz-gray">
        <CardHeader className="pb-3">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <Separator className="bg-veloz-gray/50" />
        <CardContent className="pt-4">
          {filterBar}
        </CardContent>
      </Card>

      <Card className="bg-veloz-gray border-veloz-gray">
        <CardHeader className="pb-2">
          <CardTitle>Vendas por Período</CardTitle>
        </CardHeader>
        <Separator className="bg-veloz-gray/50" />
        <CardContent className="pt-6">
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
    </div>
  );
}
