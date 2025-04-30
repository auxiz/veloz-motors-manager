
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { SaleFormValues } from './FormSchema';

interface VehicleSelectProps {
  form: UseFormReturn<SaleFormValues>;
  vehicles: any[];
  onVehicleChange: (vehicleId: string) => void;
}

export const VehicleSelect: React.FC<VehicleSelectProps> = ({ form, vehicles, onVehicleChange }) => {
  return (
    <FormField
      control={form.control}
      name="vehicleId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Veículo</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onVehicleChange(value);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um veículo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-veloz-black border-veloz-gray max-h-[300px]">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} {vehicle.version} ({vehicle.year}) - {formatCurrency(vehicle.sale_price)}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-center text-muted-foreground">
                  Nenhum veículo disponível
                </div>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
