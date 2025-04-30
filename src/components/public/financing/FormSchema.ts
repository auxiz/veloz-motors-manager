
import * as z from 'zod';

// Validation schema
export const formSchema = z.object({
  vehiclePrice: z.number().min(1000, "Valor deve ser no mínimo R$ 1.000"),
  entryValue: z.number().min(0, "Valor não pode ser negativo"),
  installments: z.number().int().min(12).max(60),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14),
  birthdate: z.string().min(1, "Data de nascimento é obrigatória"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  hasCNH: z.boolean().refine(val => val === true, {
    message: "É necessário ter CNH válida"
  }),
});

export type FormValues = z.infer<typeof formSchema>;
