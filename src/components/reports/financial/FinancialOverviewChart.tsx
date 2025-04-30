
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
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
  );
}
