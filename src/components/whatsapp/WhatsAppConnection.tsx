
import React, { useEffect, useState } from 'react';
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
  const [checkAttempts, setCheckAttempts] = useState(0);
  
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

  // Effect to automatically connect or get QR code when component mounts
  useEffect(() => {
    if (user && connectionStatus === 'disconnected') {
      console.log('Auto-initiating connection flow on component mount');
      connectWhatsApp();
    }
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
            
            {/* QR Code Display Section - Show QR code when disconnected or while connecting */}
            {((connectionStatus === 'disconnected' || connectionStatus === 'connecting') && qrCode) && (
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
