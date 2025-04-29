
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardsProps {
  performanceData: {
    userId: string;
    name: string;
    salesCount: number;
    totalSales: number;
    totalCommission: number;
    averageValue: number;
  }[];
  totalSalesAmount: number;
  totalCommissions: number;
}

export function SummaryCards({ performanceData, totalSalesAmount, totalCommissions }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total de Vendedores</CardTitle>
          <CardDescription>Com vendas no período</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{performanceData.length}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Vendas</CardTitle>
          <CardDescription>Período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {totalSalesAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Comissões</CardTitle>
          <CardDescription>Período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {totalCommissions.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
