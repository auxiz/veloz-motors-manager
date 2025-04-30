import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/hooks/useVehicles';
import { toast } from 'sonner';

export interface PlateSearchResult {
  success: boolean;
  result?: {
    veiculo: {
      marca: string;
      modelo: string;
      ano_fabricacao: number;
      ano_modelo: number;
      cor: string;
      chassi: string;
      renavam: string;
      uf: string;
      municipio: string;
      restricoes: string[];
    }
  };
  message?: string;
}

export const useLicensePlateLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlateSearchResult | null>(null);

  const searchByPlate = async (plate: string): Promise<PlateSearchResult | null> => {
    if (!plate) {
      toast.error('Placa é obrigatória para consulta');
      return null;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('license-plate-lookup', {
        body: { plate }
      });

      if (error) {
        toast.error(`Erro ao consultar placa: ${error.message}`);
        setIsLoading(false);
        return null;
      }

      setResult(data as PlateSearchResult);
      setIsLoading(false);
      
      if (!data.success) {
        toast.error(`Erro na consulta: ${data.message || 'Verifique a placa informada'}`);
        return null;
      }
      
      return data as PlateSearchResult;
    } catch (error) {
      console.error('Error searching by plate:', error);
      toast.error('Erro ao consultar placa. Tente novamente.');
      setIsLoading(false);
      return null;
    }
  };

  // Map API result to Vehicle schema
  const mapResultToVehicle = (result: PlateSearchResult): Partial<Vehicle> => {
    if (!result?.success || !result.result) return {};

    const { veiculo } = result.result;
    
    return {
      brand: veiculo.marca,
      model: veiculo.modelo,
      year: veiculo.ano_modelo,
      color: veiculo.cor,
      plate: plate,
      chassis: veiculo.chassi,
      renavam: veiculo.renavam,
      // Other fields to be filled by user
    };
  };

  return {
    searchByPlate,
    isLoading,
    result,
    mapResultToVehicle
  };
};
