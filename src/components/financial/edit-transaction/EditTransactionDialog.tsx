
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTransactionDetails } from './useTransactionDetails';
import { TransactionForm } from '../transaction-form/TransactionForm';

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
  const { transaction, defaultValues, handleSubmit, handleCancel } = useTransactionDetails({
    transactionId,
    onOpenChange
  });
  
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
