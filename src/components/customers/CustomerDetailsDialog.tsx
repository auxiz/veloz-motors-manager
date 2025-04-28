
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/hooks/useCustomers';
import { useSales } from '@/hooks/useSales';

interface CustomerDetailsDialogProps {
  customerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailsDialog: React.FC<CustomerDetailsDialogProps> = ({ 
  customerId, 
  isOpen, 
  onClose 
}) => {
  const { customers } = useCustomers();
  const { sales } = useSales();
  
  const customer = customers.find(c => c.id === customerId);
  const customerSales = sales.filter(sale => sale.customer_id === customerId);
  
  if (!customer) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-veloz-black text-veloz-white border-veloz-gray max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalhes do Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <h3 className="text-xl font-semibold">{customer.name}</h3>
          <p className="text-veloz-gray-lighter">{customer.document}</p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-blue-600">Novo Cliente</Badge>
            <Badge className="bg-green-600">Cliente Ativo</Badge>
            {customerSales.length > 0 && customerSales[0].vehicle?.brand && (
              <Badge className="bg-purple-600">Comprador de {customerSales[0].vehicle.brand}</Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg border-b border-veloz-gray pb-2">Informações de Contato</h4>
              
              <div>
                <p className="text-sm text-veloz-gray-lighter">Telefone</p>
                <p>{customer.phone || "Não informado"}</p>
              </div>
              
              <div>
                <p className="text-sm text-veloz-gray-lighter">Email</p>
                <p>{customer.email || "Não informado"}</p>
              </div>
              
              <div>
                <p className="text-sm text-veloz-gray-lighter">Endereço</p>
                <p>{customer.address || "Não informado"}</p>
              </div>
              
              <div>
                <p className="text-sm text-veloz-gray-lighter">Data de Nascimento</p>
                <p>{customer.birth_date ? new Date(customer.birth_date).toLocaleDateString() : "Não informada"}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg border-b border-veloz-gray pb-2">Histórico de Compras</h4>
              
              {customerSales.length === 0 ? (
                <p>Este cliente ainda não realizou nenhuma compra.</p>
              ) : (
                <div className="space-y-4">
                  {customerSales.map((sale) => (
                    <div key={sale.id} className="bg-veloz-black border border-veloz-gray rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold">
                            {sale.vehicle?.brand} {sale.vehicle?.model} {sale.vehicle?.version}
                          </h5>
                          <p className="text-sm text-veloz-gray-lighter">
                            {sale.vehicle?.year} • {sale.vehicle?.color}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-veloz-yellow">
                            {new Intl.NumberFormat('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            }).format(sale.final_price)}
                          </p>
                          <p className="text-sm text-veloz-gray-lighter">
                            {new Date(sale.sale_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-veloz-gray-lighter">Transmissão</p>
                          <p>{sale.vehicle?.transmission || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-veloz-gray-lighter">Combustível</p>
                          <p>{sale.vehicle?.fuel || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {customer.internal_notes && (
            <div className="mt-6">
              <h4 className="font-semibold text-lg border-b border-veloz-gray pb-2">Anotações Internas</h4>
              <p className="mt-2 whitespace-pre-wrap">{customer.internal_notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
