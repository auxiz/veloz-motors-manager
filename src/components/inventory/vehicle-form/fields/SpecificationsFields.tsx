
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

interface SpecificationsFieldsProps {
  form: UseFormReturn<VehicleFormData>;
}

export const SpecificationsFields: React.FC<SpecificationsFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="mileage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quilometragem</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Ex: 50000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fuel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Combustível</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Flex" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="transmission"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transmissão</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Automático" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
