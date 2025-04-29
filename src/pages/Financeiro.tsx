
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Plus, ArrowDown, ArrowUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionsList } from '@/components/financial/TransactionsList';
import { TransactionsFilter } from '@/components/financial/TransactionsFilter';
import { NewTransactionDialog } from '@/components/financial/NewTransactionDialog';
import { CashFlowChart } from '@/components/financial/CashFlowChart';

const Financeiro = () => {
  const [newTransactionDialogOpen, setNewTransactionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    category: '',
    status: '',
    search: '',
  });

  const { transactions, isLoading } = useTransactions();

  // Calculate summary statistics
  const summary = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount);
      
      if (transaction.type === 'income') {
        if (transaction.status === 'paid') {
          acc.totalReceived += amount;
        } else {
          acc.totalToReceive += amount;
        }
      } else if (transaction.type === 'expense') {
        if (transaction.status === 'paid') {
          acc.totalPaid += amount;
        } else {
          acc.totalPending += amount;
        }
      }
      
      return acc;
    },
    { totalReceived: 0, totalToReceive: 0, totalPaid: 0, totalPending: 0 }
  );

  const netBalance = (summary.totalReceived - summary.totalPaid);

  // Function to determine which transactions to display based on the active tab
  const getTransactionType = (): 'income' | 'expense' | undefined => {
    if (activeTab === 'income') return 'income';
    if (activeTab === 'expense') return 'expense';
    return undefined;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão Financeira</h1>
          <p className="text-muted-foreground">Controle o fluxo de caixa e monitore a lucratividade</p>
        </div>
        <Button
          className="bg-veloz-yellow hover:bg-yellow-500 text-black font-bold"
          onClick={() => setNewTransactionDialogOpen(true)}
        >
          <Plus size={18} className="mr-2" />
          Nova Transação
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-veloz-gray border-veloz-gray">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-veloz-yellow mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(summary.totalReceived)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-veloz-gray border-veloz-gray">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">A Receber</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowDown className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(summary.totalToReceive)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-veloz-gray border-veloz-gray">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowUp className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(summary.totalPaid)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-veloz-gray border-veloz-gray">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">A Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(summary.totalPending)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col gap-8">
        <Card className="bg-veloz-gray border-veloz-gray">
          <CardHeader>
            <CardTitle className="text-xl">Saldo de Caixa</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-center justify-center mb-4">
              <span className={`text-3xl font-bold ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(netBalance)}
              </span>
            </div>
            <div className="relative z-10">
              <CashFlowChart transactions={transactions} />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 max-w-md">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="income">Receitas</TabsTrigger>
            <TabsTrigger value="expense">Despesas</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
          </TabsList>
          
          <Card className="bg-veloz-gray border-veloz-gray mt-6">
            <CardHeader>
              <CardTitle className="text-xl">
                {activeTab === 'all' && 'Todas as Transações'}
                {activeTab === 'income' && 'Receitas'}
                {activeTab === 'expense' && 'Despesas'}
                {activeTab === 'pending' && 'Transações Pendentes'}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-6">
                <div className="relative z-30">
                  <TransactionsFilter onFilterChange={setFilters} />
                </div>
                <div className="relative z-20">
                  <TransactionsList 
                    transactionType={getTransactionType()}
                    status={activeTab === 'pending' ? 'pending' : undefined}
                    filters={filters}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
      
      <NewTransactionDialog open={newTransactionDialogOpen} onOpenChange={setNewTransactionDialogOpen} />
    </div>
  );
};

export default Financeiro;
