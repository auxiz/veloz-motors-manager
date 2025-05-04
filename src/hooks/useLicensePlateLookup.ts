
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
      combustivel?: string;
      tipo_veiculo?: string;
      restricoes: string[];
      placa?: string; // Add the placa property which comes from our edge function
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

  // Enhanced mapping function to include more vehicle details
  const mapResultToVehicle = (result: PlateSearchResult): Partial<Vehicle> => {
    if (!result?.success || !result.result) return {};

    const { veiculo } = result.result;
    
    return {
      brand: veiculo.marca,
      model: veiculo.modelo,
      year: veiculo.ano_modelo,
      color: veiculo.cor,
      chassis: veiculo.chassi,
      renavam: veiculo.renavam,
      plate: veiculo.placa || "",
      fuel: veiculo.combustivel || "Flex", // Default to Flex if not available
      mileage: 0, // This needs to be filled by user as it's not in the API
      transmission: "Manual", // Default value, not available in API
      purchase_price: 0, // Needs to be filled by user
      sale_price: 0, // Needs to be filled by user
      internal_notes: `Veículo consultado por placa. UF: ${veiculo.uf}, Município: ${veiculo.municipio}${veiculo.tipo_veiculo ? `, Tipo: ${veiculo.tipo_veiculo}` : ''}`,
      status: "in_stock" as "in_stock" | "reserved" | "sold", // Using type assertion to ensure compatibility
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
