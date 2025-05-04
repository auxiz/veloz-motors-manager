
import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { useUsers } from '@/hooks/useUsers';
import { 
  Loader, 
  Smartphone, 
  WifiOff
} from 'lucide-react';
import { ConnectionHeader } from './connection/ConnectionHeader';
import { ConnectionStatus } from './connection/ConnectionStatus';
import { QRCodeDisplay } from './connection/QRCodeDisplay';
import { ConnectionError } from './connection/ConnectionError';
import { AdminWarning } from './connection/AdminWarning';
import { ConnectionActions } from './connection/ConnectionActions';
import { ConnectionInstructions } from './connection/ConnectionInstructions';

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
      connectionError
    });
  }, [connectionStatus, qrCode, isLoading, connectionError]);
  
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Smartphone className="text-green-500" />;
      case 'connecting': return <Loader className="text-yellow-500 animate-spin" />;
      case 'disconnected': return <WifiOff className="text-red-500" />;
      default: return <Loader className="text-gray-500 animate-spin" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-veloz-gray text-white border-veloz-gray">
        <CardHeader>
          <ConnectionHeader 
            connectionStatus={connectionStatus}
            isLoading={isLoading}
            getStatusIcon={getStatusIcon}
          />
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center">
            <ConnectionStatus 
              connectionStatus={connectionStatus} 
              isLoading={isLoading} 
              metrics={metrics}
            />
            
            {/* QR Code Display Section */}
            {qrCode && connectionStatus !== 'connected' && (
              <QRCodeDisplay 
                qrCode={qrCode} 
                onRefreshQR={handleRefreshQR} 
                isLoading={isLoading} 
              />
            )}
            
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
            isLoading={isLoading}
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
  );
};

export default WhatsAppConnection;
