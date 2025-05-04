
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const AdminWarning: React.FC = () => {
  return (
    <Alert className="bg-yellow-900 border-yellow-800 text-white mb-4">
      <AlertTitle>Acesso de Administrador Necessário</AlertTitle>
      <AlertDescription>
        Apenas administradores podem conectar ou desconectar o WhatsApp. Contate seu administrador para assistência.
      </AlertDescription>
    </Alert>
  );
};
