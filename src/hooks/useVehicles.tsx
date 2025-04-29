
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  version: string | null;
  year: number;
  color: string;
  plate: string | null;
  mileage: number;
  fuel: string;
  transmission: string;
  purchase_price: number;
  sale_price: number;
  status: string;
  entry_date: string;
  photos: string[] | null;
  internal_notes: string | null;
};

export const useVehicles = () => {
  const queryClient = useQueryClient();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      console.log('Fetching vehicles...');
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error);
        toast.error('Erro ao carregar veículos');
        throw error;
      }

      console.log('Vehicles fetched:', data);
      return data;
    },
  });

  const addVehicle = useMutation({
    mutationFn: async (newVehicle: Omit<Vehicle, 'id'>) => {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([newVehicle])
        .select()
        .single();

      if (error) {
        toast.error('Erro ao adicionar veículo');
        throw error;
      }

      toast.success('Veículo adicionado com sucesso!');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const updateVehicle = useMutation({
    mutationFn: async ({ id, ...vehicle }: Vehicle) => {
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicle)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast.error('Erro ao atualizar veículo');
        throw error;
      }

      toast.success('Veículo atualizado com sucesso!');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const updateVehicleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data, error } = await supabase
        .from('vehicles')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast.error('Erro ao atualizar status do veículo');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  return {
    vehicles,
    isLoading,
    addVehicle,
    updateVehicle,
    updateVehicleStatus,
  };
};
