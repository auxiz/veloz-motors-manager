
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface MonthlySummaryTableProps {
  monthlyData: MonthlyData[];
}

export function MonthlySummaryTable({ monthlyData }: MonthlySummaryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo Mensal</CardTitle>
      </CardHeader>
      <Separator className="bg-border/50" />
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mês</TableHead>
              <TableHead className="text-right">Receitas</TableHead>
              <TableHead className="text-right">Despesas</TableHead>
              <TableHead className="text-right">Lucro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthlyData.length > 0 ? (
              monthlyData.map((data) => (
                <TableRow key={data.month}>
                  <TableCell className="font-medium">{data.month}</TableCell>
                  <TableCell className="text-right text-green-500">
                    {data.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className="text-right text-red-500">
                    {data.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className={`text-right ${data.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {data.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum dado financeiro encontrado no período selecionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
