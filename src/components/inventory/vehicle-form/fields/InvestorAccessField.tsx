
import React, { useEffect, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CheckboxMultiple } from '@/components/ui/checkbox-multiple';
import { useInvestors } from '@/hooks/useInvestors';
import { supabase } from '@/integrations/supabase/client';
import { VehicleFormData } from '../VehicleFormSchema';

interface InvestorAccessFieldProps {
  form: UseFormReturn<VehicleFormData>;
  vehicleId?: string;
}

export const InvestorAccessField = ({ form, vehicleId }: InvestorAccessFieldProps) => {
  const { investors, isLoading } = useInvestors();
  const [investorAccessIds, setInvestorAccessIds] = useState<string[]>([]);

  // Load existing investor access when editing a vehicle
  useEffect(() => {
    const loadInvestorAccess = async () => {
      if (vehicleId) {
        try {
          const { data, error } = await supabase
            .from('vehicle_investor_access')
            .select('user_id')
            .eq('vehicle_id', vehicleId);

          if (error) {
            console.error('Error loading investor access:', error);
            return;
          }

          const accessIds = data.map(item => item.user_id);
          setInvestorAccessIds(accessIds);
          form.setValue('investorAccess', accessIds);
        } catch (error) {
          console.error('Error fetching investor access:', error);
        }
      }
    };

    loadInvestorAccess();
  }, [vehicleId, form]);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Carregando investidores...</div>;
  }

  const investorItems = investors.map(investor => ({
    id: investor.id,
    label: investor.name || investor.email || investor.id
  }));

  if (investorItems.length === 0) {
    return <div className="text-sm text-muted-foreground">Nenhum investidor cadastrado</div>;
  }

  return (
    <FormField
      control={form.control}
      name="investorAccess"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Acesso de Investidores</FormLabel>
          <FormControl>
            <CheckboxReactHookFormMultiple 
              items={investorItems}
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
          <p className="text-xs text-muted-foreground mt-1">
            Selecione os investidores que terão acesso a este veículo
          </p>
        </FormItem>
      )}
    />
  );
};

// Use the existing CheckboxReactHookFormMultiple component
import { CheckboxReactHookFormMultiple } from '@/components/ui/checkbox-multiple';
