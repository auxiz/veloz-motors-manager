
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { File } from 'lucide-react';

const Financeiro = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestão Financeira</h1>
        <p className="text-muted-foreground">Controle o fluxo de caixa e monitore a lucratividade</p>
      </div>

      <Card className="bg-veloz-gray border-veloz-gray">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <File className="h-16 w-16 text-veloz-yellow mb-4" />
          <h2 className="text-2xl font-bold mb-4">Módulo Financeiro</h2>
          <p className="text-muted-foreground max-w-lg mb-6">
            Este módulo será implementado na próxima fase do desenvolvimento.
            Aqui você poderá gerenciar contas a pagar e receber, monitorar o fluxo de caixa e analisar a lucratividade.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Contas a Pagar</p>
              <p className="text-sm">Registro e controle de todas as despesas do negócio.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Contas a Receber</p>
              <p className="text-sm">Acompanhamento de receitas e pagamentos pendentes.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Fluxo de Caixa</p>
              <p className="text-sm">Visualização diária, mensal e anual do fluxo financeiro.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Relatórios</p>
              <p className="text-sm">Análises de lucratividade e desempenho financeiro.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Financeiro;
