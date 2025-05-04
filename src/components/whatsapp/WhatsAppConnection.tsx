
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { Loader, RefreshCw, Smartphone, WifiOff, QrCode } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUsers } from '@/hooks/useUsers';

const WhatsAppConnection: React.FC = () => {
  const { connectionStatus, qrCode, connectWhatsApp, disconnectWhatsApp, checkConnectionStatus } = useWhatsAppContext();
  const { user } = useUsers();
  
  const isAdmin = user?.profile?.role === 'administrator';
  
  const handleConnect = async () => {
    console.log('Connect button clicked');
    const result = await connectWhatsApp();
    console.log('Connect result:', result, 'QR Code available:', !!qrCode);
  };
  
  const handleDisconnect = async () => {
    await disconnectWhatsApp();
  };
  
  const handleRefresh = async () => {
    await checkConnectionStatus();
  };

  // Check connection status on initial load
  useEffect(() => {
    console.log('WhatsAppConnection component mounted');
    checkConnectionStatus();
  }, []);

  // Debug rendering
  useEffect(() => {
    console.log('Render state:', { connectionStatus, qrCodeAvailable: !!qrCode });
  }, [connectionStatus, qrCode]);
  
  return (
    <div className="space-y-6">
      <Card className="bg-veloz-gray text-white border-veloz-gray">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <Smartphone className="text-green-500" />
            ) : (
              <WifiOff className="text-red-500" />
            )}
            Status da Conexão WhatsApp
          </CardTitle>
          <CardDescription className="text-gray-400">
            {connectionStatus === 'connected' && 'WhatsApp está conectado e pronto para receber mensagens.'}
            {connectionStatus === 'disconnected' && 'WhatsApp não está conectado. Conecte para começar a receber mensagens.'}
            {connectionStatus === 'connecting' && 'Conectando ao WhatsApp...'}
            {connectionStatus === 'unknown' && 'Verificando status da conexão...'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="mb-4 p-3 bg-veloz-black rounded-md inline-flex items-center">
              <span className={`h-3 w-3 rounded-full mr-2 ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></span>
              <span>
                {connectionStatus === 'connected' ? 'Conectado' : 
                 connectionStatus === 'connecting' ? 'Conectando...' :
                 'Desconectado'}
              </span>
            </div>
            
            {/* QR Code Display Section */}
            {qrCode && (
              <div className="my-4 flex flex-col items-center p-4 bg-white rounded-lg">
                <div className="flex items-center mb-2 text-black">
                  <QrCode className="mr-2 text-black" size={20} />
                  <p className="font-medium">Escaneie este QR code com WhatsApp no seu celular</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-md">
                  <img 
                    src={qrCode} 
                    alt="WhatsApp QR Code" 
                    className="mx-auto max-w-xs"
                    onError={(e) => {
                      console.error('Error loading QR code image');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <p className="mt-2 text-sm text-black">O QR Code expirará após alguns minutos</p>
              </div>
            )}
            
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
          {isAdmin && connectionStatus !== 'connected' && (
            <Button 
              variant="default" 
              className="bg-veloz-yellow text-black hover:bg-yellow-500"
              onClick={handleConnect}
              disabled={connectionStatus === 'connecting'}
            >
              {connectionStatus === 'connecting' ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Conectar WhatsApp'
              )}
            </Button>
          )}
          
          {isAdmin && connectionStatus === 'connected' && (
            <Button 
              variant="destructive" 
              onClick={handleDisconnect}
            >
              Desconectar WhatsApp
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="border-veloz-gray text-white"
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
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
