
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ConnectionInitializerProps {
  connectionStatus: string;
  isLoading: boolean;
  userId?: string;
  connectWhatsApp: () => Promise<void>;
  refreshQRCode: () => Promise<void>;
  qrCode: string | null;
}

export const ConnectionInitializer: React.FC<ConnectionInitializerProps> = ({
  connectionStatus,
  isLoading,
  userId,
  connectWhatsApp,
  refreshQRCode,
  qrCode
}) => {
  const [initializingConnection, setInitializingConnection] = useState(false);
  
  // Effect to automatically connect or get QR code when component mounts
  // or when disconnected status is detected
  useEffect(() => {
    const initializeConnection = async () => {
      if (!userId) return;
      
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
  }, [userId, connectionStatus, isLoading, initializingConnection, connectWhatsApp]);

  // Handle situations where we're disconnected without a QR code
  useEffect(() => {
    // If we're disconnected without a QR code and not loading/initializing, 
    // we should try to get a QR code for the user
    if (
      (connectionStatus === 'disconnected' || connectionStatus === 'connecting') && 
      !qrCode && 
      !isLoading && 
      !initializingConnection && 
      userId
    ) {
      console.log('Disconnected without QR code, attempting to refresh');
      refreshQRCode().catch(error => console.error('Error refreshing QR code:', error));
    }
  }, [connectionStatus, qrCode, isLoading, initializingConnection, userId, refreshQRCode]);
  
  return null; // This is a behavior-only component with no UI
};
