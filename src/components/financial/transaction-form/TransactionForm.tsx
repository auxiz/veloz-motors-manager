
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { TypeField } from './fields/TypeField';
import { CategoryField } from './fields/CategoryField';
import { DescriptionField } from './fields/DescriptionField';
import { AmountField } from './fields/AmountField';
import { StatusField } from './fields/StatusField';
import { DueDateField } from './fields/DueDateField';
import { FormActions } from './FormActions';
import { transactionSchema, TransactionFormValues } from './transaction-schema';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<TransactionFormValues>;
}

export function TransactionForm({ onSubmit, onCancel, defaultValues }: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'income',
      description: '',
      amount: 0,
      status: 'pending',
      category: '',
      ...defaultValues,
    },
  });

  const handleSubmit = (data: TransactionFormValues) => {
    onSubmit(data);
  };

  const isEditing = !!defaultValues;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <TypeField control={form.control} />
          <CategoryField control={form.control} />
        </div>
        
        <DescriptionField control={form.control} />
        
        <div className="grid grid-cols-2 gap-4">
          <AmountField control={form.control} />
          <StatusField control={form.control} />
        </div>
        
        <DueDateField control={form.control} />
        
        <FormActions onCancel={onCancel} isEditing={isEditing} />
      </form>
    </Form>
  );
}
