
import React from 'react';
import { useSales } from '@/hooks/useSales';
import { formatCurrency } from '@/lib/utils';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateSaleContract } from '@/lib/contractGenerator';

export const SalesList = () => {
  const { sales, isLoading } = useSales();

  const handleGenerateContract = (sale: any) => {
    generateSaleContract(sale);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">Carregando vendas...</p>
      </div>
    );
  }

  if (!sales.length) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-muted-foreground">Nenhuma venda registrada</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Veículo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Comissão</TableHead>
            <TableHead className="text-right">Contrato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>
                {sale.sale_date 
                  ? format(new Date(sale.sale_date), "dd/MM/yyyy", { locale: ptBR })
                  : 'N/A'
                }
              </TableCell>
              <TableCell>
                {sale.vehicle?.brand} {sale.vehicle?.model} {sale.vehicle?.version}
              </TableCell>
              <TableCell>{sale.customer?.name}</TableCell>
              <TableCell>{sale.seller_id ? sale.seller_id.substring(0, 8) : 'N/A'}</TableCell>
              <TableCell>{formatCurrency(sale.final_price)}</TableCell>
              <TableCell>
                <Badge
                  className={`${
                    sale.payment_method === 'cash' ? 'bg-green-700' : 
                    sale.payment_method === 'financing' ? 'bg-blue-700' : 
                    'bg-orange-700'
                  }`}
                >
                  {sale.payment_method === 'cash' ? 'À Vista' :
                   sale.payment_method === 'financing' ? 'Financiamento' :
                   sale.payment_method === 'consignment' ? 'Consignação' :
                   'Troca'}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(sale.commission_amount)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleGenerateContract(sale)}
                >
                  <FileText size={16} className="mr-1" />
                  Contrato
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
