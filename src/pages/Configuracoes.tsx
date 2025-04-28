
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const Configuracoes = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">Personalize o sistema e gerencie usuários</p>
      </div>

      <Card className="bg-veloz-gray border-veloz-gray">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <Settings className="h-16 w-16 text-veloz-yellow mb-4" />
          <h2 className="text-2xl font-bold mb-4">Módulo de Configurações</h2>
          <p className="text-muted-foreground max-w-lg mb-6">
            Este módulo será implementado na próxima fase do desenvolvimento.
            Aqui você poderá gerenciar usuários, definir permissões e personalizar o sistema.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Usuários</p>
              <p className="text-sm">Cadastro e gerenciamento de acesso ao sistema.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Permissões</p>
              <p className="text-sm">Configuração de níveis de acesso e funcionalidades.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Dados da Empresa</p>
              <p className="text-sm">Informações usadas em documentos e relatórios.</p>
            </div>
            <div className="bg-veloz-black p-4 rounded-lg">
              <p className="font-medium text-veloz-yellow mb-1">Supabase</p>
              <p className="text-sm">Integração com Supabase para autenticação e armazenamento.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;
