import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { formatCurrency, formatDate } from '@/lib/utils';
import { EditTransactionDialog } from './edit-transaction/EditTransactionDialog';

interface TransactionsListProps {
  transactionType?: 'income' | 'expense';
  status?: 'pending' | 'paid';
  filters?: {
    startDate: Date | null;
    endDate: Date | null;
    category: string;
    status: string;
    search: string;
  };
}

export const TransactionsList = ({ 
  transactionType, 
  status,
  filters 
}: TransactionsListProps) => {
  const { transactions, isLoading, updateTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = React.useState<string | null>(null);

  let filteredTransactions = transactions;

  // Filter by transaction type if specified
  if (transactionType) {
    filteredTransactions = filteredTransactions.filter(t => t.type === transactionType);
  }

  // Filter by status if specified
  if (status) {
    filteredTransactions = filteredTransactions.filter(t => t.status === status);
  }

  // Apply additional filters
  if (filters) {
    if (filters.startDate) {
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.due_date) >= filters.startDate!
      );
    }
    
    if (filters.endDate) {
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.due_date) <= filters.endDate!
      );
    }
    
    if (filters.category && filters.category !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => 
        t.category === filters.category
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => 
        t.status === filters.status
      );
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(t => 
        t.description.toLowerCase().includes(searchLower) || 
        t.category.toLowerCase().includes(searchLower)
      );
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Carregando transações...</div>;
  }

  if (filteredTransactions.length === 0) {
    return <div className="text-center py-8">Nenhuma transação encontrada.</div>;
  }

  const handleStatusChange = (transaction: Transaction) => {
    const newStatus = transaction.status === 'paid' ? 'pending' : 'paid';
    updateTransaction.mutate({
      ...transaction, 
      status: newStatus
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{formatDate(transaction.due_date)}</TableCell>
              <TableCell className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    transaction.status === 'paid' 
                      ? 'bg-green-500/20 text-green-500 border-green-500' 
                      : 'bg-yellow-500/20 text-yellow-500 border-yellow-500'
                  }
                >
                  {transaction.status === 'paid' ? 'Pago' : 'Pendente'}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setEditingTransaction(transaction.id)}
                >
                  Editar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleStatusChange(transaction)}
                >
                  {transaction.status === 'paid' ? 'Marcar Pendente' : 'Marcar Pago'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {editingTransaction && (
        <EditTransactionDialog 
          transactionId={editingTransaction}
          open={!!editingTransaction}
          onOpenChange={(open) => {
            if (!open) setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};
