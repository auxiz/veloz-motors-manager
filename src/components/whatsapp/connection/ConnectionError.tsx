
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ConnectionErrorProps {
  error: string;
}

export const ConnectionError: React.FC<ConnectionErrorProps> = ({ error }) => {
  return (
    <Alert className="bg-red-900 border-red-800 text-white mb-4">
      <AlertTitle className="text-red-200">Erro</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};
