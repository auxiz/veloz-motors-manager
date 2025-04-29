
import * as z from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, { message: 'Selecione uma categoria' }),
  description: z.string().min(3, { message: 'Digite uma descrição válida' }),
  amount: z.coerce.number().min(0.01, { message: 'Digite um valor válido' }),
  status: z.enum(['pending', 'paid']),
  due_date: z.date().transform(date => date.toISOString()),
  sale_id: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
