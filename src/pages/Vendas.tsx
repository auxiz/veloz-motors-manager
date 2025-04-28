
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

const Vendas = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Controle de Vendas</h1>
        <p className="text-muted-foreground">Gerencie as vendas de veículos</p>
      </div>

      <Card className="bg-veloz-gray border-veloz-gray">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <DollarSign className="h-16 w-16 text-veloz-yellow mb-4" />
          <h2 className="text-2xl font-bold mb-4">Módulo de Vendas</h2>
          <p className="text-muted-foreground max-w-lg mb-6">
            Este módulo será implementado na próxima fase do desenvolvimento.
            Aqui você poderá registrar vendas, calcular comissões e gerar contratos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Registro de Vendas</p>
              <p className="text-sm">Vinculação de veículos, clientes e condições de pagamento.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Comissões</p>
              <p className="text-sm">Cálculo automático de comissões para vendedores.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Contratos</p>
              <p className="text-sm">Geração de contratos de compra e venda.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Acompanhamento</p>
              <p className="text-sm">Monitoramento do status de cada venda.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vendas;
