
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { SalesReports } from '@/components/reports/SalesReports';
import { InventoryReports } from '@/components/reports/InventoryReports';
import { FinancialReports } from '@/components/reports/FinancialReports';
import { SalesPerformanceReports } from '@/components/reports/SalesPerformanceReports';
import { ScheduledReportsManager } from '@/components/reports/ScheduledReportsManager';
import { format, subMonths } from 'date-fns';
import { AuthGuard } from '@/components/auth/AuthGuard';

const Relatorios = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subMonths(new Date(), 3),
    to: new Date()
  });

  return (
    <AuthGuard allowedRoles={['administrator', 'financial']}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
            <p className="text-muted-foreground">Analise o desempenho do seu negócio com dados detalhados</p>
          </div>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>

        <ScheduledReportsManager />

        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-4">
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="inventory">Estoque</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales">
            <SalesReports dateRange={dateRange} />
          </TabsContent>
          
          <TabsContent value="inventory">
            <InventoryReports dateRange={dateRange} />
          </TabsContent>
          
          <TabsContent value="financial">
            <FinancialReports dateRange={dateRange} />
          </TabsContent>
          
          <TabsContent value="performance">
            <SalesPerformanceReports dateRange={dateRange} />
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
};

export default Relatorios;
