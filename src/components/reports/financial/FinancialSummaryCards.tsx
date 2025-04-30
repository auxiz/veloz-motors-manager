
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancialSummaryCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
}

export function FinancialSummaryCards({ 
  totalRevenue, 
  totalExpenses, 
  profit 
}: FinancialSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Receitas Totais</CardTitle>
          <CardDescription>Período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-500">
            {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Despesas Totais</CardTitle>
          <CardDescription>Período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-500">
            {totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Lucro Total</CardTitle>
          <CardDescription>Período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
