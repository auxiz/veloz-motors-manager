
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Sale } from '@/types/sales';
import { Vehicle } from '@/hooks/useVehicles';
import { User } from '@/hooks/useUsers';

interface SalesDetailsTableProps {
  filteredSales: Sale[];
  allSalesCount: number;
  vehicles: Vehicle[];
  users: User[];
  downloadCSV: () => void;
  downloadPDF: () => void;
}

export function SalesDetailsTable({
  filteredSales,
  allSalesCount,
  vehicles,
  users,
  downloadCSV,
  downloadPDF
}: SalesDetailsTableProps) {
  // Enhanced helper function to get the seller name with better fallbacks
  const getSellerName = (sale: Sale) => {
    // First try using the joined seller data from the sale object
    if (sale.seller?.first_name) {
      return `${sale.seller.first_name} ${sale.seller.last_name || ''}`.trim();
    }
    
    // Then try finding the user in the users array using seller_id
    const seller = users.find(user => user.id === sale.seller_id);
    if (seller) {
      if (seller.profile?.first_name) {
        return `${seller.profile.first_name} ${seller.profile.last_name || ''}`.trim();
      }
      return seller.name || seller.email.split('@')[0];
    }
    
    // Last resort for debugging - show partial ID
    return sale.seller_id ? `ID: ${sale.seller_id.substring(0, 6)}...` : 'Vendedor não identificado';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Detalhamento de Vendas</CardTitle>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map(sale => {
                  const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
                  
                  return (
                    <TableRow key={sale.id}>
                      <TableCell>{format(new Date(sale.sale_date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        {vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 
                         sale.vehicle ? `${sale.vehicle.brand} ${sale.vehicle.model} ${sale.vehicle.year}` : 
                         'Veículo não encontrado'}
                      </TableCell>
                      <TableCell>{getSellerName(sale)}</TableCell>
                      <TableCell>{sale.customer?.name || 'Cliente não especificado'}</TableCell>
                      <TableCell className="text-right">
                        {Number(sale.final_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhuma venda encontrada para o período e filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredSales.length} de {allSalesCount} vendas
        </div>
      </CardFooter>
    </Card>
  );
}
