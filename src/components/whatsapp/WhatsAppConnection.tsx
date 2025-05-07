
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { useUsers } from '@/hooks/useUsers';
import { 
  Loader, 
  Smartphone, 
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner';
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
  const [checkAttempts, setCheckAttempts] = useState(0);
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

  // Effect to automatically connect or get QR code when component mounts
  // or when disconnected status is detected
  useEffect(() => {
    const initializeConnection = async () => {
      if (!user) return;
      
      // Only auto-connect if we're disconnected and not already loading or initializing
      if (connectionStatus === 'disconnected' && !isLoading && !initializingConnection) {
        try {
          console.log('Auto-initiating connection flow');
          setInitializingConnection(true);
          await connectWhatsApp();
        } catch (error) {
          console.error('Error in auto-connection:', error);
        } finally {
          setInitializingConnection(false);
        }
      }
    };

    initializeConnection();
  }, [user, connectionStatus]);

  // Check connection status on initial load and set up polling with backoff
  useEffect(() => {
    console.log('WhatsAppConnection component mounted');
    
    if (!user) {
      console.log('User not logged in, skipping connection checks');
      return;
    }
    
    // Check status immediately
    checkConnectionStatus();
    
    // Set up polling for status updates with exponential backoff
    // Start with 30 seconds, max out at 5 minutes
    const minInterval = 30000; // 30 seconds
    const maxInterval = 300000; // 5 minutes
    const backoffFactor = 1.5;
    
    let currentInterval = minInterval;
    
    const scheduleNextCheck = () => {
      const timeoutId = setTimeout(async () => {
        console.log(`Checking connection status, interval: ${currentInterval / 1000}s`);
        
        try {
          await checkConnectionStatus();
          // Successful check, reset interval
          currentInterval = minInterval;
          setCheckAttempts(0);
        } catch (error) {
          // Failed check, increase backoff
          setCheckAttempts(prev => prev + 1);
          currentInterval = Math.min(currentInterval * backoffFactor, maxInterval);
          console.log(`Check failed, new interval: ${currentInterval / 1000}s`);
        }
        
        // Schedule next check
        scheduleNextCheck();
      }, currentInterval);
      
      return timeoutId;
    };
    
    const timeoutId = scheduleNextCheck();
    
    // Clean up on unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, [user?.id]);

  // Debug rendering
  useEffect(() => {
    console.log('Render state:', { 
      connectionStatus, 
      qrCodeAvailable: !!qrCode,
      isLoading,
      connectionError,
      user: !!user
    });
  }, [connectionStatus, qrCode, isLoading, connectionError, user]);
  
  // Handle situations where we're disconnected without a QR code
  useEffect(() => {
    // If we're disconnected without a QR code and not loading/initializing, 
    // we should try to get a QR code for the user
    if (
      (connectionStatus === 'disconnected' || connectionStatus === 'connecting') && 
      !qrCode && 
      !isLoading && 
      !initializingConnection && 
      user
    ) {
      console.log('Disconnected without QR code, attempting to refresh');
      refreshQRCode().catch(error => console.error('Error refreshing QR code:', error));
    }
  }, [connectionStatus, qrCode, isLoading, initializingConnection, user]);
  
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Smartphone className="text-green-500" />;
      case 'connecting': return <Loader className="text-yellow-500 animate-spin" />;
      case 'disconnected': return <WifiOff className="text-red-500" />;
      default: return <Loader className="text-gray-500 animate-spin" />;
    }
  };

  // Don't show the component if user is not logged in
  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-medium mb-4">Login Required</h2>
        <p>Please log in to access WhatsApp connection features.</p>
      </div>
    );
  }
  
  // Determine whether to show the QR code
  const shouldShowQRCode = 
    (connectionStatus === 'disconnected' || connectionStatus === 'connecting') && 
    (qrCode || initializingConnection);
  
  return (
    <div className="space-y-6">
      <Card className="bg-veloz-gray text-white border-veloz-gray">
        <CardHeader>
          <ConnectionHeader 
            connectionStatus={connectionStatus}
            isLoading={isLoading || initializingConnection}
            getStatusIcon={getStatusIcon}
          />
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center">
            <ConnectionStatus 
              connectionStatus={connectionStatus} 
              isLoading={isLoading || initializingConnection} 
              metrics={metrics}
            />
            
            {/* QR Code Display Section - Always show QR code when disconnected or connecting */}
            {shouldShowQRCode ? (
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
  );
};

export default WhatsAppConnection;
