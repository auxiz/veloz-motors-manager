
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUsers } from '@/hooks/useUsers';
import { 
  Loader, 
  RefreshCw, 
  Smartphone, 
  WifiOff, 
  QrCode,
  Send,
  Bell,
  BellRing,
  LinkIcon,
  Disconnect 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const WhatsAppConnection: React.FC = () => {
  const { 
    connectionStatus, 
    qrCode, 
    isLoading,
    error,
    metrics,
    connectWhatsApp, 
    disconnectWhatsApp,
    reconnectWhatsApp,
    checkConnectionStatus,
    refreshQRCode
  } = useWhatsAppContext();
  
  const { user } = useUsers();
  
  const isAdmin = user?.profile?.role === 'administrator';
  
  const handleConnect = async () => {
    console.log('Connect button clicked');
    await connectWhatsApp();
  };
  
  const handleDisconnect = async () => {
    await disconnectWhatsApp();
  };
  
  const handleReconnect = async () => {
    await reconnectWhatsApp();
  };
  
  const handleRefresh = async () => {
    await checkConnectionStatus();
  };
  
  const handleRefreshQR = async () => {
    await refreshQRCode();
  };

  // Check connection status on initial load and set up polling
  useEffect(() => {
    console.log('WhatsAppConnection component mounted');
    
    // Check status immediately
    checkConnectionStatus();
    
    // Set up polling for status updates every 30 seconds
    const intervalId = setInterval(() => {
      checkConnectionStatus();
    }, 30000);
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Debug rendering
  useEffect(() => {
    console.log('Render state:', { 
      connectionStatus, 
      qrCodeAvailable: !!qrCode,
      isLoading,
      error
    });
  }, [connectionStatus, qrCode, isLoading, error]);
  
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
      default: return <RefreshCw className="text-gray-500 animate-spin" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-veloz-gray text-white border-veloz-gray">
        <CardHeader>
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
        </CardHeader>
        
        <CardContent>
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
            
            {/* QR Code Display Section */}
            {qrCode && connectionStatus !== 'connected' && (
              <div className="my-4 flex flex-col items-center p-4 bg-white rounded-lg w-full max-w-xs mx-auto">
                <div className="flex items-center mb-2 text-black">
                  <QrCode className="mr-2 text-black" size={20} />
                  <p className="font-medium">Escaneie este QR code com WhatsApp</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-md">
                  <img 
                    src={qrCode} 
                    alt="WhatsApp QR Code" 
                    className="mx-auto max-w-full h-auto"
                    onError={(e) => {
                      console.error('Error loading QR code image');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="mt-2 flex flex-col items-center text-center">
                  <p className="text-sm text-black mb-2">O QR Code expirará após alguns minutos</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-1 text-black border-black hover:bg-gray-100"
                    onClick={handleRefreshQR}
                    disabled={isLoading}
                  >
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Atualizar QR Code
                  </Button>
                </div>
              </div>
            )}
            
            {/* Error Display */}
            {error && (
              <Alert className="bg-red-900 border-red-800 text-white mb-4">
                <AlertTitle className="text-red-200">Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Admin Access Warning */}
            {!isAdmin && (
              <Alert className="bg-yellow-900 border-yellow-800 text-white mb-4">
                <AlertTitle>Acesso de Administrador Necessário</AlertTitle>
                <AlertDescription>
                  Apenas administradores podem conectar ou desconectar o WhatsApp. Contate seu administrador para assistência.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4">
          {isAdmin && (
            <>
              {connectionStatus !== 'connected' && (
                <Button 
                  variant="default" 
                  className="bg-veloz-yellow text-black hover:bg-yellow-500"
                  onClick={handleConnect}
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
                  onClick={handleDisconnect}
                  disabled={isLoading}
                >
                  <Disconnect className="mr-2 h-4 w-4" />
                  Desconectar WhatsApp
                </Button>
              )}
              
              {connectionStatus === 'disconnected' && (
                <Button 
                  variant="outline" 
                  className="border-yellow-500 text-yellow-500 hover:bg-yellow-900"
                  onClick={handleReconnect}
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
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar Status
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-white space-y-4">
        <h2 className="text-xl font-semibold">Como Conectar o WhatsApp</h2>
        
        <div className="space-y-2">
          <p>1. Clique no botão "Conectar WhatsApp" acima.</p>
          <p>2. Aguarde o QR code aparecer.</p>
          <p>3. Abra o WhatsApp no seu celular e escaneie o QR code:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Android: Configurações &gt; Aparelhos conectados &gt; Conectar um aparelho</li>
            <li>iPhone: Configurações &gt; Aparelhos conectados &gt; Conectar um aparelho</li>
          </ul>
          <p>4. Uma vez conectado, você começará a receber mensagens do WhatsApp no CRM.</p>
          <p>5. A conexão do WhatsApp permanecerá ativa enquanto o servidor estiver em execução.</p>
        </div>
        
        <div className="bg-amber-900 border border-amber-800 p-4 rounded-md">
          <h3 className="font-semibold text-amber-300">Notas Importantes:</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-white">
            <li>Esta é uma integração não oficial do WhatsApp usando automação de navegador.</li>
            <li>O WhatsApp não oferece suporte oficial a este tipo de integração.</li>
            <li>A conexão pode precisar ser atualizada ocasionalmente.</li>
            <li>Para uso em produção, considere a API oficial do WhatsApp Business.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConnection;
