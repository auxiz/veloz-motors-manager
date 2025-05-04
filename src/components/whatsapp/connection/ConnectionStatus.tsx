
import React from 'react';
import { Loader, Smartphone, WifiOff } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ConnectionStatus as ConnectionStatusType } from '@/hooks/whatsapp/types';

interface ConnectionStatusProps {
  connectionStatus: ConnectionStatusType;
  isLoading: boolean;
  metrics?: any;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connectionStatus,
  isLoading,
  metrics
}) => {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando...';
      case 'disconnected': return 'Desconectado';
      default: return 'Verificando status...';
    }
  };
  
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Smartphone className="text-green-500" />;
      case 'connecting': return <Loader className="text-yellow-500 animate-spin" />;
      case 'disconnected': return <WifiOff className="text-red-500" />;
      default: return <Loader className="text-gray-500 animate-spin" />;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Status Indicator */}
      <div className="mb-4 p-3 bg-veloz-black rounded-md inline-flex items-center">
        <span className={`h-3 w-3 rounded-full mr-2 ${getStatusColor()}`}></span>
        <span>{getStatusText()}</span>
      </div>
      
      {/* Metrics Display */}
      {connectionStatus === 'connected' && metrics && (
        <div className="w-full p-3 mb-4 bg-veloz-black rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <p className="text-gray-400 text-xs">Última Atividade</p>
            <p className="font-medium">
              {metrics.lastActivity 
                ? new Date(metrics.lastActivity).toLocaleString('pt-BR')
                : 'Não disponível'}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-gray-400 text-xs">Tentativas de Reconexão</p>
            <p className="font-medium">{metrics.reconnectAttempts || 0}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-gray-400 text-xs">Fila de Mensagens</p>
            <p className="font-medium">{metrics.messageQueueSize || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};
