
import * as z from 'zod';

export const CATEGORIES = [
  'venda',
  'imposto',
  'manutenção',
  'salário',
  'aluguel',
  'marketing',
  'outros'
];

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], { 
    required_error: 'Selecione o tipo da transação'
  }),
  description: z.string().min(3, { 
    message: 'Descrição deve ter pelo menos 3 caracteres'
  }),
  amount: z.coerce.number().min(0, {
    message: 'Valor deve ser maior que zero'
  }),
  status: z.enum(['paid', 'pending'], {
    required_error: 'Selecione o status da transação'
  }),
  due_date: z.date({
    required_error: 'Selecione uma data de vencimento'
  }),
  category: z.string().min(1, {
    message: 'Selecione uma categoria'
  }),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
