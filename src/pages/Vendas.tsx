
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Plus, FileText } from 'lucide-react';
import { useSales } from '@/hooks/useSales';
import { SalesList } from '@/components/sales/SalesList';
import { SalesFilter } from '@/components/sales/SalesFilter';
import { NewSaleDialog } from '@/components/sales/NewSaleDialog';

const Vendas = () => {
  const [newSaleDialogOpen, setNewSaleDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    sellerName: '',
    status: '',
    search: '',
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Controle de Vendas</h1>
          <p className="text-muted-foreground">Gerencie as vendas de veículos</p>
        </div>
        <Button
          className="bg-veloz-yellow hover:bg-yellow-500 text-black font-bold"
          onClick={() => setNewSaleDialogOpen(true)}
        >
          <Plus size={18} className="mr-2" />
          Nova Venda
        </Button>
      </div>

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
                {/* Will use the same component with filters */}
                <SalesList />
              </TabsContent>
              
              <TabsContent value="financing" className="mt-0">
                {/* Will use the same component with filters */}
                <SalesList />
              </TabsContent>
              
              <TabsContent value="other" className="mt-0">
                {/* Will use the same component with filters */}
                <SalesList />
              </TabsContent>
            </div>
          </CardContent>
        </Card>
      </Tabs>
      
      <NewSaleDialog open={newSaleDialogOpen} onOpenChange={setNewSaleDialogOpen} />
    </div>
  );
};

export default Vendas;
