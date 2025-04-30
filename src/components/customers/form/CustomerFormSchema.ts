
import * as z from 'zod';

export const customerSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  document: z.string().min(11, { message: 'CPF/CNPJ inválido' }),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  birth_date: z.date().optional().nullable(),
  internal_notes: z.string().optional().or(z.literal('')),
  status: z.string().default('active'),
  tags: z.array(z.string()).default([]),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
