
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { TransactionForm } from './transaction-form/TransactionForm';
import { transactionSchema, TransactionFormValues } from './transaction-form/transaction-schema';

interface EditTransactionDialogProps {
  transactionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({ 
  transactionId, 
  open, 
  onOpenChange 
}: EditTransactionDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da transação financeira.
          </DialogDescription>
        </DialogHeader>
        
        {transaction && (
          <TransactionForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
            defaultValues={defaultValues}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
