
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SellersRankingTableProps {
  performanceData: {
    userId: string;
    name: string;
    salesCount: number;
    totalSales: number;
    totalCommission: number;
    averageValue: number;
  }[];
}

export function SellersRankingTable({ performanceData }: SellersRankingTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking de Vendedores</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead className="text-right">Qtd. Vendas</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="text-right">Comissões</TableHead>
              <TableHead className="text-right">Valor Médio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performanceData.length > 0 ? (
              performanceData.map((user, index) => (
                <TableRow key={user.userId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-right">{user.salesCount}</TableCell>
                  <TableCell className="text-right">
                    {user.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.totalCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.averageValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhum dado de vendedor encontrado no período selecionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
