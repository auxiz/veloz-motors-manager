
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  // Enhanced comprehensive seller name function with detailed fallbacks
  const getSellerName = (sale: any) => {
    // Try multiple paths to get the seller name with detailed fallbacks
    
    // 1. First try from the sale.seller object (from join)
    if (sale.seller?.first_name) {
      return `${sale.seller.first_name} ${sale.seller.last_name || ''}`.trim();
    }
    
    // 2. Try to match seller_id with users data
    if (sale.seller_id) {
      const seller = users.find(user => user.id === sale.seller_id);
      if (seller) {
        // If user has profile data
        if (seller.profile?.first_name) {
          return `${seller.profile.first_name} ${seller.profile.last_name || ''}`.trim();
        }
        // Fall back to user name or email
        if (seller.name) return seller.name;
        if (seller.email) return seller.email.split('@')[0];
      }
      
      // 3. If we at least have seller_id, show a partial ID for debugging
      return `ID: ${sale.seller_id.substring(0, 6)}...`;
    }
    
    // 4. Last resort
    return 'Vendedor não identificado';
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

  // Function to get payment method display name
  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      'cash': 'À Vista',
      'financing': 'Financiamento',
      'consignment': 'Consignação',
      'exchange': 'Troca',
      'bank_transfer': 'Transferência',
      'installments': 'Parcelado'
    };
    
    return methods[method] || method;
  };

  return (
    <div className="overflow-x-auto">
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        {sale.vehicle?.brand} {sale.vehicle?.model} {sale.vehicle?.version}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        <strong>Ano:</strong> {sale.vehicle?.year}<br />
                        <strong>Cor:</strong> {sale.vehicle?.color}<br />
                        <strong>Combustível:</strong> {sale.vehicle?.fuel}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{sale.customer?.name || 'Cliente não especificado'}</TableCell>
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
                  {getPaymentMethodName(sale.payment_method)}
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
