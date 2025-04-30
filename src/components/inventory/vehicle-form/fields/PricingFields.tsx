
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VehicleFormData } from "../VehicleFormSchema";

interface PricingFieldsProps {
  form: UseFormReturn<VehicleFormData>;
}

export const PricingFields: React.FC<PricingFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="purchase_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço de Compra</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Ex: 50000" 
                prefix="R$" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sale_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço de Venda</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Ex: 55000" 
                prefix="R$" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
