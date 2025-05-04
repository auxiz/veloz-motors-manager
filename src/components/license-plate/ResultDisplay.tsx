
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlateSearchResult } from '@/hooks/useLicensePlateLookup';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ResultDisplayProps {
  result: PlateSearchResult;
  onRegisterVehicle?: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onRegisterVehicle }) => {
  if (!result?.success || !result.result) {
    return (
      <Card className="bg-veloz-gray border-veloz-gray mt-4">
        <CardHeader>
          <CardTitle>Veículo não encontrado</CardTitle>
          <CardDescription>
            Nenhum dado encontrado para a placa informada.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { veiculo } = result.result;
  
  return (
    <Card className="bg-veloz-gray border-veloz-gray mt-4">
      <CardHeader>
        <CardTitle className="text-xl flex justify-between items-center">
          {veiculo.marca} {veiculo.modelo}
          <Badge className="bg-veloz-yellow text-veloz-black">
            {veiculo.ano_fabricacao}/{veiculo.ano_modelo}
          </Badge>
        </CardTitle>
        <CardDescription>
          {veiculo.cor}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm text-muted-foreground">Chassis</h3>
            <p className="text-lg">{veiculo.chassi || 'Não disponível'}</p>
          </div>
          <div>
            <h3 className="text-sm text-muted-foreground">RENAVAM</h3>
            <p className="text-lg">{veiculo.renavam || 'Não disponível'}</p>
          </div>
          <div>
            <h3 className="text-sm text-muted-foreground">UF</h3>
            <p className="text-lg">{veiculo.uf || 'Não disponível'}</p>
          </div>
          <div>
            <h3 className="text-sm text-muted-foreground">Município</h3>
            <p className="text-lg">{veiculo.municipio || 'Não disponível'}</p>
          </div>
        </div>
        
        {veiculo.restricoes && veiculo.restricoes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm text-muted-foreground mb-2">Restrições</h3>
            <div className="flex flex-wrap gap-2">
              {veiculo.restricoes.map((restricao, index) => (
                <Badge key={index} className="bg-destructive">
                  {restricao}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {onRegisterVehicle && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <div className="text-center">
              <p className="text-lg font-medium mb-3">Deseja cadastrar este veículo agora?</p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={onRegisterVehicle}
                  className="bg-veloz-yellow hover:bg-yellow-500 text-veloz-black flex items-center gap-2"
                >
                  <Check size={18} />
                  Sim, cadastrar
                </Button>
                <Button 
                  variant="outline"
                  className="border-veloz-gray text-veloz-white hover:bg-veloz-gray/50 flex items-center gap-2"
                >
                  <X size={18} />
                  Não
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
