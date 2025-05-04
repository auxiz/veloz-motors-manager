
import * as z from "zod";

export const vehicleSchema = z.object({
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  version: z.string().optional(),
  year: z.number().min(1900, "Ano inválido"),
  color: z.string().min(1, "Cor é obrigatória"),
  plate: z.string().optional(),
  renavam: z.string().optional(),
  chassis: z.string().optional(),
  mileage: z.number().min(0, "Quilometragem não pode ser negativa"),
  fuel: z.string().min(1, "Combustível é obrigatório"),
  transmission: z.string().min(1, "Transmissão é obrigatória"),
  purchase_price: z.number().min(0, "Preço de compra não pode ser negativo"),
  sale_price: z.number().min(0, "Preço de venda não pode ser negativo"),
  internal_notes: z.string().optional(),
  photos: z.array(z.string()).optional(),
  status: z.enum(["in_stock", "reserved", "sold"]),
  investorAccess: z.array(z.string()).default([]).optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
