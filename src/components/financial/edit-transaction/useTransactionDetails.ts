
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { TransactionFormValues } from '../transaction-form/transaction-schema';

interface UseTransactionDetailsProps {
  transactionId: string;
  onOpenChange: (open: boolean) => void;
}

export function useTransactionDetails({ transactionId, onOpenChange }: UseTransactionDetailsProps) {
  const { transactions, updateTransaction } = useTransactions();
  
  // Find the transaction to edit
  const transaction = transactions.find(t => t.id === transactionId);
  
  const handleSubmit = (data: TransactionFormValues) => {
    if (!transaction) return;
    
    const updatedTransaction: Transaction = {
      id: transaction.id,
      type: data.type,
      category: data.category,
      description: data.description,
      amount: data.amount,
      due_date: data.due_date.toISOString().split('T')[0],
      status: data.status,
      sale_id: transaction.sale_id,
    };
    
    updateTransaction.mutate(updatedTransaction);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };
  
  // Default values for the form
  const defaultValues: Partial<TransactionFormValues> = transaction ? {
    type: transaction.type,
    category: transaction.category,
    description: transaction.description,
    amount: transaction.amount,
    status: transaction.status,
    due_date: transaction.due_date ? new Date(transaction.due_date) : new Date(),
  } : {};

  return {
    transaction,
    defaultValues,
    handleSubmit,
    handleCancel
  };
}
