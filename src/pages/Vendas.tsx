
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useSales } from '@/hooks/useSales';
import { SalesList } from '@/components/sales/SalesList';
import { SalesFilter } from '@/components/sales/SalesFilter';
import { NewSaleDialog } from '@/components/sales/NewSaleDialog';
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'sonner';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { supabase } from '@/integrations/supabase/client';

const Vendas = () => {
  const [newSaleDialogOpen, setNewSaleDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { user, isAuthChecking } = useUsers();
  const { refreshSales } = useSales();
  const [filters, setFilters] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    sellerName: '',
    status: '',
    search: '',
  });

  // Set up realtime updates for sales
  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel('sales-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales'
        },
        (payload) => {
          console.log('Sales table updated:', payload.eventType);
          refreshSales();
          
          const eventMessages = {
            INSERT: 'Nova venda registrada',
            UPDATE: 'Venda atualizada',
            DELETE: 'Venda removida'
          };
          
          // Show toast notification
          toast.info(eventMessages[payload.eventType as keyof typeof eventMessages] || 'Vendas atualizadas');
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshSales]);

  // Log authentication state for debugging
  useEffect(() => {
    console.log('Vendas page - Current user:', user);
    console.log('Auth checking state:', isAuthChecking);
  }, [user, isAuthChecking]);

  const handleNewSaleClick = () => {
    if (!user) {
      toast.error('Você precisa estar autenticado para registrar uma venda');
      return;
    }
    setNewSaleDialogOpen(true);
  };

  return (
    <AuthGuard allowedRoles={['administrator', 'seller']}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Controle de Vendas</h1>
            <p className="text-muted-foreground">Gerencie as vendas de veículos</p>
          </div>
          <Button
            className="bg-veloz-yellow hover:bg-yellow-500 text-black font-bold"
            onClick={handleNewSaleClick}
          >
            <Plus size={18} className="mr-2" />
            Nova Venda
          </Button>
        </div>

      {user ? (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 max-w-md">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="cash">À Vista</TabsTrigger>
            <TabsTrigger value="financing">Financiamento</TabsTrigger>
            <TabsTrigger value="other">Outras</TabsTrigger>
          </TabsList>
          
          <Card className="bg-veloz-gray border-veloz-gray mt-6">
            <CardHeader>
              <CardTitle className="text-xl">
                {activeTab === 'all' && 'Todas as Vendas'}
                {activeTab === 'cash' && 'Vendas à Vista'}
                {activeTab === 'financing' && 'Vendas Financiadas'}
                {activeTab === 'other' && 'Outras Modalidades'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <SalesFilter onFilterChange={setFilters} />
                
                <TabsContent value="all" className="mt-0">
                  <SalesList />
                </TabsContent>
                
                <TabsContent value="cash" className="mt-0">
                  <SalesList filter="cash" />
                </TabsContent>
                
                <TabsContent value="financing" className="mt-0">
                  <SalesList filter="financing" />
                </TabsContent>
                
                <TabsContent value="other" className="mt-0">
                  <SalesList filter="other" />
                </TabsContent>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      ) : (
        <Card className="bg-veloz-gray border-veloz-gray">
          <CardContent className="p-8 text-center">
            {isAuthChecking ? (
              <p>Verificando autenticação...</p>
            ) : (
              <>
                <p className="text-lg mb-4">Você precisa estar autenticado para acessar o controle de vendas.</p>
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="bg-veloz-yellow hover:bg-yellow-500 text-black font-semibold"
                >
                  Ir para login
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
      
      <NewSaleDialog open={newSaleDialogOpen} onOpenChange={setNewSaleDialogOpen} />
    </div>
    </AuthGuard>
  );
};

export default Vendas;
