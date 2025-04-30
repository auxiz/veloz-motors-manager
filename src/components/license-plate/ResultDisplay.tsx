
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlateSearchResult } from '@/hooks/useLicensePlateLookup';

interface ResultDisplayProps {
  result: PlateSearchResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
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
      </CardContent>
    </Card>
  );
};
