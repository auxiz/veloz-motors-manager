
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const Relatorios = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
        <p className="text-muted-foreground">Analise o desempenho do seu negócio com dados detalhados</p>
      </div>

      <Card className="bg-veloz-gray border-veloz-gray">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <BarChart3 className="h-16 w-16 text-veloz-yellow mb-4" />
          <h2 className="text-2xl font-bold mb-4">Módulo de Relatórios</h2>
          <p className="text-muted-foreground max-w-lg mb-6">
            Este módulo será implementado na próxima fase do desenvolvimento.
            Aqui você poderá gerar relatórios customizados, visualizar estatísticas de vendas e monitorar KPIs importantes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Vendas</p>
              <p className="text-sm">Análise de vendas por período, modelo e vendedor.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Estoque</p>
              <p className="text-sm">Tempo médio em estoque e giro de inventário.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Lucratividade</p>
              <p className="text-sm">Margens e desempenho financeiro por veículo.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Dashboards</p>
              <p className="text-sm">Painéis visuais com os principais indicadores.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;
