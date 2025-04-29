
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SalesSummaryCardsProps {
  totalSales: number;
  totalAmount: number;
}

export function SalesSummaryCards({ totalSales, totalAmount }: SalesSummaryCardsProps) {
  const averageSaleValue = totalSales > 0 ? totalAmount / totalSales : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total de Vendas</CardTitle>
          <CardDescription>Período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalSales}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Valor Total</CardTitle>
          <CardDescription>Período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Média por Venda</CardTitle>
          <CardDescription>Período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {averageSaleValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
