
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface FinancialOverviewChartProps {
  monthlyData: MonthlyData[];
  onDownloadCSV: () => void;
}

export function FinancialOverviewChart({ 
  monthlyData,
  onDownloadCSV 
}: FinancialOverviewChartProps) {
  const chartConfig = {
    revenue: { label: 'Receitas' },
    expenses: { label: 'Despesas' },
    profit: { label: 'Lucro' },
  };

  // Format large values for better readability in the chart
  const formatYAxis = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Visão Geral Financeira</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onDownloadCSV}>
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
        <div className="h-[450px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                barGap={8}
                barSize={24}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="month" 
                  stroke="#999" 
                  padding={{ left: 10, right: 10 }}
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: "#555" }}
                  height={50}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="#999" 
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: "#555" }}
                  width={60}
                  tickMargin={8}
                />
                <Tooltip 
                  content={<ChartTooltipContent />} 
                  cursor={{ opacity: 0.3 }}
                  animationDuration={300}
                  wrapperStyle={{ zIndex: 1000 }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
                />
                <Bar 
                  dataKey="revenue" 
                  name="Receitas" 
                  fill="#4ade80" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                  isAnimationActive={true}
                />
                <Bar 
                  dataKey="expenses" 
                  name="Despesas" 
                  fill="#f87171" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                  isAnimationActive={true}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="Lucro" 
                  stroke="#facc15" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1200}
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
