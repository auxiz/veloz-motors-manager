import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
export function SalesChart({
  chartData,
  filterBar
}: SalesChartProps) {
  const chartConfig = {
    value: {
      label: 'Qtd. de Veículos'
    },
    amount: {
      label: 'Valor Total (R$)'
    }
  };

  // Format large values for better readability
  const formatYAxis = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };
  return <div className="space-y-4">
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
        <CardContent className="pt-6 py-0">
          <div className="h-[250px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 80
              }} barGap={12} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#999" padding={{
                  left: 10,
                  right: 10
                }} tick={{
                  fontSize: 11
                }} tickLine={{
                  stroke: "#555"
                }} height={80} angle={-30} textAnchor="end" tickMargin={10} />
                  <YAxis stroke="#999" tickFormatter={formatYAxis} tick={{
                  fontSize: 12
                }} tickLine={{
                  stroke: "#555"
                }} width={60} tickMargin={8} />
                  <Tooltip content={<ChartTooltipContent />} cursor={{
                  opacity: 0.3
                }} animationDuration={300} wrapperStyle={{
                  zIndex: 1000
                }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{
                  fontSize: '12px'
                }} />
                  <Bar dataKey="value" name="Quantidade" fill="#4ade80" radius={[4, 4, 0, 0]} animationDuration={800} isAnimationActive={true} />
                  <Bar dataKey="amount" name="Valor (R$)" fill="#f87171" radius={[4, 4, 0, 0]} animationDuration={1200} isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>;
}