
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader, RefreshCw, LinkIcon, PowerOff } from 'lucide-react';
import { ConnectionStatus } from '@/hooks/whatsapp/types';

interface ConnectionActionsProps {
  connectionStatus: ConnectionStatus;
  isLoading: boolean;
  isAdmin: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  onReconnect: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const ConnectionActions: React.FC<ConnectionActionsProps> = ({
  connectionStatus,
  isLoading,
  isAdmin,
  onConnect,
  onDisconnect,
  onReconnect,
  onRefresh
}) => {
  return (
    <div className="flex justify-center gap-4">
      {isAdmin && (
        <>
          {connectionStatus !== 'connected' && (
            <Button 
              variant="default" 
              className="bg-veloz-yellow text-black hover:bg-yellow-500"
              onClick={onConnect}
              disabled={isLoading || connectionStatus === 'connecting'}
            >
              {(isLoading && connectionStatus === 'connecting') ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Conectar WhatsApp
                </>
              )}
            </Button>
          )}
          
          {connectionStatus === 'connected' && (
            <Button 
              variant="destructive" 
              onClick={onDisconnect}
              disabled={isLoading}
            >
              <PowerOff className="mr-2 h-4 w-4" />
              Desconectar WhatsApp
            </Button>
          )}
          
          {connectionStatus === 'disconnected' && (
            <Button 
              variant="outline" 
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-900"
              onClick={onReconnect}
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reconectar WhatsApp
            </Button>
          )}
        </>
      )}
      
      <Button 
        variant="outline" 
        className="border-veloz-gray text-white"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Atualizar Status
      </Button>
    </div>
  );
};
