
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { SalesReports } from '@/components/reports/SalesReports';
import { InventoryReports } from '@/components/reports/InventoryReports';
import { FinancialReports } from '@/components/reports/FinancialReports';
import { SalesPerformanceReports } from '@/components/reports/SalesPerformanceReports';
import { ScheduledReportsManager } from '@/components/reports/ScheduledReportsManager';
import { subMonths } from 'date-fns';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Separator } from '@/components/ui/separator';

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
      <div className="space-y-6 md:space-y-8">
        <Card className="bg-veloz-gray border-veloz-gray">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold mb-1">Relatórios</CardTitle>
              <p className="text-muted-foreground">Analise o desempenho do seu negócio com dados detalhados</p>
            </div>
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
          </CardHeader>
        </Card>

        <ScheduledReportsManager />

        <Card className="bg-veloz-gray border-veloz-gray">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Relatórios Disponíveis</CardTitle>
          </CardHeader>
          <Separator className="bg-veloz-gray/50" />
          <CardContent className="pt-6">
            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-3xl mb-6">
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
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
};

export default Relatorios;
