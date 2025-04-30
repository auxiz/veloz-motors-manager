
import { z } from "zod";

export const vehicleSchema = z.object({
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  version: z.string().optional(),
  year: z.coerce.number().min(1900, "Ano inválido").max(new Date().getFullYear() + 1),
  color: z.string().min(1, "Cor é obrigatória"),
  plate: z.string().optional(),
  renavam: z.string().optional(),
  chassis: z.string().optional(),
  mileage: z.coerce.number().min(0, "Quilometragem inválida"),
  fuel: z.string().min(1, "Combustível é obrigatório"),
  transmission: z.string().min(1, "Transmissão é obrigatória"),
  purchase_price: z.coerce.number().min(0, "Preço de compra é obrigatório"),
  sale_price: z.coerce.number().min(0, "Preço de venda é obrigatório"),
  internal_notes: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
