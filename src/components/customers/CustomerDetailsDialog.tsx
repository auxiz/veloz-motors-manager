
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, FileText, Tag } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useSales } from '@/hooks/useSales';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

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
  
  // Get sales for this customer
  const customerSales = sales.filter(sale => sale.customer_id === customerId);
  
  if (!customer) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-veloz-black text-veloz-white border-veloz-gray max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex justify-between items-center">
            <span>Detalhes do Cliente</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 sm:w-auto sm:px-3"
              onClick={onClose}
            >
              <Edit size={16} className="sm:mr-2" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-veloz-gray p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium">{customer.name}</h3>
              <p className="text-veloz-yellow">CPF/CNPJ: {customer.document}</p>
            </div>
            <div className="text-right">
              <p>{customer.email}</p>
              <p>{customer.phone || 'Telefone não cadastrado'}</p>
            </div>
          </div>
          {customer.address && (
            <p className="mt-2 text-sm text-muted-foreground">{customer.address}</p>
          )}
          {customer.birth_date && (
            <p className="mt-1 text-sm text-muted-foreground">
              Data de Nascimento: {format(new Date(customer.birth_date), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          )}
        </div>
        
        <Tabs defaultValue="purchases" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="purchases">Compras</TabsTrigger>
            <TabsTrigger value="notes">Anotações</TabsTrigger>
            <TabsTrigger value="segments">Segmentação</TabsTrigger>
          </TabsList>
          
          <TabsContent value="purchases" className="space-y-4">
            {customerSales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Este cliente ainda não realizou nenhuma compra.
              </div>
            ) : (
              customerSales.map((sale) => (
                <Card key={sale.id} className="bg-veloz-gray border-veloz-gray">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          {sale.vehicle?.brand} {sale.vehicle?.model} {sale.vehicle?.version}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Ano: {sale.vehicle?.year} • Cor: {sale.vehicle?.color}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-veloz-yellow font-semibold">
                          {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          }).format(sale.final_price)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sale.sale_date ? format(new Date(sale.sale_date), 'dd/MM/yyyy', { locale: ptBR }) : 'Data não registrada'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="notes">
            <div className="space-y-4">
              <Textarea 
                value={customer.internal_notes || ''} 
                placeholder="Sem anotações para este cliente" 
                className="min-h-[200px] bg-veloz-gray border-veloz-gray"
                readOnly
              />
            </div>
          </TabsContent>
          
          <TabsContent value="segments">
            <div className="space-y-4">
              <div className="bg-veloz-gray p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <Tag size={16} className="mr-2 text-veloz-yellow" />
                  Categorias do Cliente
                </h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge className="bg-blue-600">Novo Cliente</Badge>
                  <Badge className="bg-green-600">Cliente Ativo</Badge>
                  {customerSales.length > 0 && <Badge className="bg-purple-600">Comprador de {customerSales[0].vehicle?.brand}</Badge>}
                </div>
              </div>
              
              <div className="bg-veloz-gray p-4 rounded-lg">
                <h3 className="font-medium mb-2">Preferências</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {customerSales.length > 0 && (
                    <>
                      <Badge variant="outline">
                        {customerSales[0].vehicle?.transmission === 'automatic' ? 'Câmbio Automático' : 'Câmbio Manual'}
                      </Badge>
                      <Badge variant="outline">
                        Combustível: {customerSales[0].vehicle?.fuel}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
