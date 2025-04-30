
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Sale } from '@/types/sales';
import { Vehicle } from '@/hooks/useVehicles';
import { User } from '@/hooks/useUsers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  // Enhanced comprehensive helper function to get the seller name with multi-level fallbacks
  const getSellerName = (sale: Sale) => {
    // 1. First try using the joined seller data from the sale object
    if (sale.seller?.first_name) {
      return `${sale.seller.first_name} ${sale.seller.last_name || ''}`.trim();
    }
    
    // 2. Try finding the user in the users array using seller_id
    const seller = users.find(user => user.id === sale.seller_id);
    if (seller) {
      // Check for profile data
      if (seller.profile?.first_name) {
        return `${seller.profile.first_name} ${seller.profile.last_name || ''}`.trim();
      }
      // Fall back to name or email
      if (seller.name) return seller.name;
      if (seller.email) return seller.email.split('@')[0];
    }
    
    // 3. If we have seller_id, show partial ID for debugging
    if (sale.seller_id) {
      return `ID: ${sale.seller_id.substring(0, 6)}...`;
    }
    
    // 4. Last resort
    return 'Vendedor não identificado';
  };
  
  // Function to get vehicle info with fallback
  const getVehicleInfo = (sale: Sale) => {
    // First try from the joined vehicle data
    if (sale.vehicle?.brand) {
      return `${sale.vehicle.brand} ${sale.vehicle.model} ${sale.vehicle.year}`;
    }
    
    // Fall back to lookup in vehicles array
    const vehicle = vehicles.find(v => v.id === sale.vehicle_id);
    if (vehicle) {
      return `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
    }
    
    // Last resort
    return 'Veículo não encontrado';
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
                filteredSales.map(sale => (
                  <TableRow key={sale.id}>
                    <TableCell>{format(new Date(sale.sale_date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              {getVehicleInfo(sale)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              <strong>ID:</strong> {sale.vehicle_id.substring(0, 8)}...<br />
                              {sale.vehicle?.color && <><strong>Cor:</strong> {sale.vehicle.color}<br /></>}
                              {sale.vehicle?.fuel && <><strong>Combustível:</strong> {sale.vehicle.fuel}<br /></>}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{getSellerName(sale)}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              {sale.customer?.name || 'Cliente não especificado'}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {sale.customer?.document && 
                              <p><strong>Documento:</strong> {sale.customer.document}</p>
                            }
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(sale.final_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
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
