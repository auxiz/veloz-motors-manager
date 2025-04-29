
import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TransactionForm } from './transaction-form/TransactionForm';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { TransactionFormValues } from './transaction-form/transaction-schema';

interface NewTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTransactionDialog({ open, onOpenChange }: NewTransactionDialogProps) {
  const { addTransaction } = useTransactions();
  
  const handleSubmit = (data: TransactionFormValues) => {
    const newTransaction: Omit<Transaction, 'id'> = {
      type: data.type,
      description: data.description,
      amount: data.amount, // This is already a number thanks to z.coerce.number()
      status: data.status,
      category: data.category,
      due_date: format(data.due_date, 'yyyy-MM-dd'),
    };
    
    addTransaction.mutate(newTransaction);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Adicione uma nova transação financeira ao sistema.
          </DialogDescription>
        </DialogHeader>
        
        <TransactionForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}
