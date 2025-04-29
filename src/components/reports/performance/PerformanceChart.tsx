
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface PerformanceChartProps {
  chartData: {
    name: string;
    sales: number;
    value: number;
    commission: number;
  }[];
  downloadCSV: () => void;
  downloadPDF: () => void;
}

export function PerformanceChart({ chartData, downloadCSV, downloadPDF }: PerformanceChartProps) {
  // Chart config
  const chartConfig = {
    sales: { label: 'Qtd. Vendas' },
    value: { label: 'Valor Total (R$)' },
    commission: { label: 'Comissões (R$)' }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Desempenho por Vendedor</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={downloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button size="sm" variant="outline" onClick={downloadPDF}>
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
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
              <Bar dataKey="sales" name="Qtd. Vendas" fill="#4ade80" />
              <Bar dataKey="value" name="Valor (R$)" fill="#f87171" />
              <Bar dataKey="commission" name="Comissões (R$)" fill="#facc15" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
