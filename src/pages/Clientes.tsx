
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

const Clientes = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestão de Clientes</h1>
        <p className="text-muted-foreground">Gerencie informações de clientes e histórico de compras</p>
      </div>

      <Card className="bg-veloz-gray border-veloz-gray">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <User className="h-16 w-16 text-veloz-yellow mb-4" />
          <h2 className="text-2xl font-bold mb-4">Módulo de Clientes</h2>
          <p className="text-muted-foreground max-w-lg mb-6">
            Este módulo será implementado na próxima fase do desenvolvimento.
            Aqui você poderá cadastrar clientes, visualizar histórico de compras e gerenciar anotações sobre os clientes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Cadastro Completo</p>
              <p className="text-sm">Dados pessoais, documentos e formas de contato.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Histórico de Compras</p>
              <p className="text-sm">Acompanhe todas as transações realizadas por cliente.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Anotações</p>
              <p className="text-sm">Registre informações importantes sobre cada cliente.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Segmentação</p>
              <p className="text-sm">Organize clientes por categorias e preferências.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;
