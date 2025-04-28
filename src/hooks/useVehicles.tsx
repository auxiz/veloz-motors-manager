
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Vehicle = {
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
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Erro ao carregar veículos');
        throw error;
      }

      return data as Vehicle[];
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

  return {
    vehicles,
    isLoading,
    addVehicle,
    updateVehicle,
  };
};
