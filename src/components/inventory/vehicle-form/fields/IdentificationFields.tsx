
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

interface IdentificationFieldsProps {
  form: UseFormReturn<VehicleFormData>;
}

export const IdentificationFields: React.FC<IdentificationFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="plate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placa</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: ABC1234" 
                className="uppercase"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chassis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chassis</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 9BWHE21JX24060960" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="renavam"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Renavam</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 00123456789" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
