
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
import { useUsers } from '@/hooks/useUsers';

interface SalesListProps {
  filter?: 'cash' | 'financing' | 'other';
}

export const SalesList: React.FC<SalesListProps> = ({ filter }) => {
  const { sales, isLoading } = useSales();
  const { users } = useUsers();

  // Apply filter if provided
  const filteredSales = filter 
    ? sales.filter(sale => {
        if (filter === 'cash') return sale.payment_method === 'cash';
        if (filter === 'financing') return sale.payment_method === 'financing';
        if (filter === 'other') return sale.payment_method !== 'cash' && sale.payment_method !== 'financing';
        return true;
      })
    : sales;

  const handleGenerateContract = (sale: any) => {
    generateSaleContract(sale);
  };

  // Helper function to get seller name
  const getSellerName = (sale: any) => {
    // First try to use the seller data from the joined profiles table
    if (sale.seller?.first_name) {
      return `${sale.seller.first_name} ${sale.seller.last_name || ''}`.trim();
    }
    
    // Fallback to users data if available
    const seller = users.find(user => user.id === sale.seller_id);
    if (seller) {
      return seller.name;
    }
    
    // Last resort fallback
    return 'Vendedor';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">Carregando vendas...</p>
      </div>
    );
  }

  if (!filteredSales.length) {
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
          {filteredSales.map((sale) => (
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
              <TableCell>{getSellerName(sale)}</TableCell>
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
