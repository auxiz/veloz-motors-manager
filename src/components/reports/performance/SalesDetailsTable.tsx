
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Sale } from '@/hooks/useSales';
import { Vehicle } from '@/hooks/useVehicles';
import { User } from '@/hooks/useUsers';

interface SalesDetailsTableProps {
  filteredSales: Sale[];
  users: User[];
  vehicles: Vehicle[];
  downloadPDF?: () => void;
}

export function SalesDetailsTable({ filteredSales, users, vehicles, downloadPDF }: SalesDetailsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Detalhamento de Vendas por Vendedor</CardTitle>
          {downloadPDF && (
            <Button size="sm" variant="outline" onClick={downloadPDF}>
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendedor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Comissão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => {
                const seller = users.find(user => user.id === sale.seller_id);
                const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
                
                return (
                  <TableRow key={sale.id}>
                    <TableCell>{seller?.name || 'N/A'}</TableCell>
                    <TableCell>{format(new Date(sale.sale_date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'N/A'}
                    </TableCell>
                    <TableCell>{sale.customer?.name || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      {Number(sale.final_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(sale.commission_amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhuma venda encontrada no período selecionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
