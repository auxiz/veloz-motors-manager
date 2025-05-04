
import React from 'react';
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from 'lucide-react';
import { ConnectionStatus } from '@/hooks/whatsapp/types';

interface ConnectionHeaderProps {
  connectionStatus: ConnectionStatus;
  isLoading: boolean;
  getStatusIcon: () => React.ReactNode;
}

export const ConnectionHeader: React.FC<ConnectionHeaderProps> = ({
  connectionStatus,
  isLoading,
  getStatusIcon
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          {getStatusIcon()}
          Status da Conexão WhatsApp
        </CardTitle>
        
        {isLoading && (
          <Badge variant="outline" className="flex items-center gap-1 text-yellow-400 border-yellow-400">
            <Loader className="h-3 w-3 animate-spin" />
            Atualizando...
          </Badge>
        )}
      </div>
      
      <CardDescription className="text-gray-400">
        {connectionStatus === 'connected' && 'WhatsApp está conectado e pronto para receber mensagens.'}
        {connectionStatus === 'disconnected' && 'WhatsApp não está conectado. Conecte para começar a receber mensagens.'}
        {connectionStatus === 'connecting' && 'Conectando ao WhatsApp... Escaneie o QR code com seu celular.'}
        {connectionStatus === 'unknown' && 'Verificando status da conexão...'}
      </CardDescription>
    </>
  );
};
