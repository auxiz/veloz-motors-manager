
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
      if (filters.category && transaction.category !== filters.category) return false;
      
      // Filter by status from filter component
      if (filters.status && transaction.status !== filters.status) return false;
      
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
    await updateTransaction.mutateAsync({
      id,
      status: currentStatus === 'paid' ? 'pending' : 'paid'
    });
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
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right relative">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="group">
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
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
                <TableCell className="text-right space-x-2">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-70 hover:opacity-100"
                      onClick={() => setEditingTransaction(transaction.id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-70 hover:opacity-100"
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    </>
  );
};
