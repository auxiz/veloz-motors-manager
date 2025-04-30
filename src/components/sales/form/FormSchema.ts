
import * as z from 'zod';

export const saleSchema = z.object({
  vehicleId: z.string().min(1, { message: 'Selecione um veículo' }),
  customerId: z.string().min(1, { message: 'Selecione um cliente' }),
  finalPrice: z.number().min(1, { message: 'Digite um valor válido' }),
  paymentMethod: z.string().min(1, { message: 'Selecione uma forma de pagamento' }),
  commissionType: z.enum(['fixed', 'percentage']),
  commissionValue: z.number().min(0, { message: 'Digite um valor válido para comissão' }),
});

export type SaleFormValues = z.infer<typeof saleSchema>;
