
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { useUsers } from '@/hooks/useUsers';
import { Smartphone, WifiOff, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { ConnectionHeader } from './connection/ConnectionHeader';
import { ConnectionStatus } from './connection/ConnectionStatus';
import { QRCodeDisplay } from './connection/QRCodeDisplay';
import { ConnectionError } from './connection/ConnectionError';
import { AdminWarning } from './connection/AdminWarning';
import { ConnectionActions } from './connection/ConnectionActions';
import { ConnectionInstructions } from './connection/ConnectionInstructions';
import { ConnectionInitializer } from './connection/ConnectionInitializer';
import { StatusPoller } from './connection/StatusPoller';

const WhatsAppConnection: React.FC = () => {
  const { 
    connectionStatus, 
    qrCode, 
    isLoading,
    connectionError,
    metrics,
    connectWhatsApp, 
    disconnectWhatsApp,
    reconnectWhatsApp,
    checkConnectionStatus,
    refreshQRCode
  } = useWhatsAppContext();
  
  const { user } = useUsers();
  const [initializingConnection, setInitializingConnection] = useState(false);
  
  const isAdmin = user?.profile?.role === 'administrator';
  
  const handleConnect = async () => {
    try {
      setInitializingConnection(true);
      console.log('Connect button clicked');
      await connectWhatsApp();
    } catch (error) {
      console.error('Error connecting to WhatsApp:', error);
      toast.error('Erro ao conectar ao WhatsApp');
    } finally {
      setInitializingConnection(false);
    }
  };
  
  const handleDisconnect = async () => {
    await disconnectWhatsApp();
  };
  
  const handleReconnect = async () => {
    try {
      setInitializingConnection(true);
      await reconnectWhatsApp();
    } catch (error) {
      console.error('Error reconnecting to WhatsApp:', error);
      toast.error('Erro ao reconectar ao WhatsApp');
    } finally {
      setInitializingConnection(false);
    }
  };
  
  const handleRefresh = async () => {
    await checkConnectionStatus();
  };
  
  const handleRefreshQR = async () => {
    await refreshQRCode();
  };

  // Set up connection initialization and status polling
  if (user) {
    // These components handle side effects without rendering UI
    return (
      <>
        <ConnectionInitializer 
          connectionStatus={connectionStatus}
          isLoading={isLoading}
          userId={user?.id}
          connectWhatsApp={connectWhatsApp}
          refreshQRCode={refreshQRCode}
          qrCode={qrCode}
        />
        
        <StatusPoller 
          userId={user?.id}
          checkConnectionStatus={checkConnectionStatus}
        />
        
        <div className="space-y-6">
          <Card className="bg-veloz-gray text-white border-veloz-gray">
            <CardHeader>
              <ConnectionHeader 
                connectionStatus={connectionStatus}
                isLoading={isLoading || initializingConnection}
                getStatusIcon={() => getStatusIcon(connectionStatus)}
              />
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col items-center">
                <ConnectionStatus 
                  connectionStatus={connectionStatus} 
                  isLoading={isLoading || initializingConnection} 
                  metrics={metrics}
                />
                
                {/* QR Code Display Section - Show when disconnected/connecting */}
                {shouldShowQRCode(connectionStatus, qrCode, initializingConnection) ? (
                  qrCode ? (
                    <QRCodeDisplay 
                      qrCode={qrCode} 
                      onRefreshQR={handleRefreshQR} 
                      isLoading={isLoading || initializingConnection} 
                    />
                  ) : (
                    <div className="my-4 p-8 bg-white rounded-lg w-full max-w-xs mx-auto text-center">
                      <Loader className="mx-auto text-black animate-spin mb-2" />
                      <p className="text-black">Carregando QR Code...</p>
                    </div>
                  )
                ) : null}
                
                {/* Error Display */}
                {connectionError && (
                  <ConnectionError error={connectionError} />
                )}
                
                {/* Admin Access Warning */}
                {!isAdmin && <AdminWarning />}
              </div>
            </CardContent>
            
            <CardFooter>
              <ConnectionActions
                connectionStatus={connectionStatus}
                isLoading={isLoading || initializingConnection}
                isAdmin={isAdmin}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onReconnect={handleReconnect}
                onRefresh={handleRefresh}
              />
            </CardFooter>
          </Card>
          
          <ConnectionInstructions />
        </div>
      </>
    );
  }

  // Don't show the component if user is not logged in
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-medium mb-4">Login Required</h2>
      <p>Please log in to access WhatsApp connection features.</p>
    </div>
  );
};

// Helper functions extracted to reduce component complexity
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'connected': return <Smartphone className="text-green-500" />;
    case 'connecting': return <Loader className="text-yellow-500 animate-spin" />;
    case 'disconnected': return <WifiOff className="text-red-500" />;
    default: return <Loader className="text-gray-500 animate-spin" />;
  }
};

const shouldShowQRCode = (
  status: string, 
  qrCode: string | null, 
  initializing: boolean
) => {
  return (status === 'disconnected' || status === 'connecting') && 
    (qrCode || initializing);
};

export default WhatsAppConnection;
