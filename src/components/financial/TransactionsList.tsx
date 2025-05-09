
import React from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency } from '@/lib/utils';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditTransactionDialog } from './edit-transaction/EditTransactionDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TransactionsListProps {
  transactionType?: 'income' | 'expense';
  status?: 'paid' | 'pending';
  filters: {
    startDate: Date | null;
    endDate: Date | null;
    category: string;
    status: string;
    search: string;
  };
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactionType, status, filters }) => {
  const { transactions, updateTransaction, isLoading } = useTransactions();
  const [editingTransaction, setEditingTransaction] = React.useState<string | null>(null);
  
  // Filter transactions based on props and filters
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(transaction => {
      // Type filter
      if (transactionType && transaction.type !== transactionType) return false;
      
      // Status filter from props
      if (status && transaction.status !== status) return false;
      
      // Filter by date range
      if (filters.startDate && new Date(transaction.due_date) < filters.startDate) return false;
      if (filters.endDate) {
        // Set time to end of day for end date
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (new Date(transaction.due_date) > endDate) return false;
      }
      
      // Filter by category
      if (filters.category && filters.category !== 'all' && transaction.category !== filters.category) return false;
      
      // Filter by status from filter component
      if (filters.status && filters.status !== 'all' && transaction.status !== filters.status) return false;
      
      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchTerm) ||
          transaction.category.toLowerCase().includes(searchTerm)
        );
      }
      
      return true;
    });
  }, [transactions, transactionType, status, filters]);
  
  const handleStatusToggle = async (id: string, currentStatus: 'paid' | 'pending') => {
    // Find the full transaction object
    const fullTransaction = transactions.find(t => t.id === id);
    
    if (fullTransaction) {
      // Only update the status field
      await updateTransaction.mutateAsync({
        ...fullTransaction,
        status: currentStatus === 'paid' ? 'pending' : 'paid'
      });
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Carregando transações...</div>;
  }

  if (filteredTransactions.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Nenhuma transação encontrada para os filtros selecionados.</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="overflow-x-auto relative z-10">
        <div className="w-full min-w-max">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">
                  <div className="truncate">Descrição</div>
                </TableHead>
                <TableHead className="w-[15%]">
                  <div className="truncate">Categoria</div>
                </TableHead>
                <TableHead className="w-[15%]">Data</TableHead>
                <TableHead className="text-right w-[15%]">Valor</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="text-right w-[15%]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="group">
                  <TableCell>
                    <div className="truncate max-w-[200px]" title={transaction.description}>
                      {transaction.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="truncate max-w-[120px]" title={transaction.category}>
                      {transaction.category}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={isPast(new Date(transaction.due_date)) && transaction.status === 'pending' ? 'text-red-500' : ''}>
                      {format(new Date(transaction.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </TableCell>
                  <TableCell className={`text-right font-mono ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${
                      transaction.status === 'paid' ? 'bg-green-700 hover:bg-green-800' : 'bg-amber-700 hover:bg-amber-800'
                    }`}>
                      {transaction.status === 'paid' ? 'Pago' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right p-2">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-70 hover:opacity-100"
                            onClick={() => setEditingTransaction(transaction.id)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-70 hover:opacity-100"
                            onClick={() => handleStatusToggle(transaction.id, transaction.status)}
                          >
                            {transaction.status === 'paid' ? (
                              <XCircle className="h-4 w-4 text-amber-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            <span className="sr-only">
                              {transaction.status === 'paid' ? 'Marcar como pendente' : 'Marcar como pago'}
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {transaction.status === 'paid' ? 'Marcar como pendente' : 'Marcar como pago'}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {editingTransaction && (
        <EditTransactionDialog
          transactionId={editingTransaction}
          open={!!editingTransaction}
          onOpenChange={(open) => {
            if (!open) setEditingTransaction(null);
          }}
        />
      )}
    </TooltipProvider>
  );
};
