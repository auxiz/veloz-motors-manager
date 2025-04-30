
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { VehicleFormData } from "../VehicleFormSchema";

interface NotesFieldProps {
  form: UseFormReturn<VehicleFormData>;
}

export const NotesField: React.FC<NotesFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="internal_notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observações Internas</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Adicione notas ou observações sobre o veículo"
              className="min-h-[100px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
