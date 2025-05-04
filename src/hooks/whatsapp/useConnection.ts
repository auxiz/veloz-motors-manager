
import { useConnectionState } from './connection/useConnectionState';
import { useConnectionActions } from './connection/actions';

export const useConnection = () => {
  const {
    connectionStatus,
    qrCode,
    isLoading,
    connectionError,
    metrics,
    setConnectionStatus,
    setQrCode,
    setIsLoading,
    setConnectionError,
    setMetrics
  } = useConnectionState();

  // Pass all state setters as an object to the actions hook
  const {
    connectWhatsApp,
    disconnectWhatsApp,
    reconnectWhatsApp,
    checkConnectionStatus,
    refreshQRCode
  } = useConnectionActions({
    setConnectionStatus,
    setQrCode,
    setIsLoading,
    setConnectionError,
    setMetrics
  });

  return {
    // Connection state
    connectionStatus,
    qrCode,
    isLoading,
    connectionError,
    metrics,
    
    // Connection actions
    connectWhatsApp,
    disconnectWhatsApp,
    reconnectWhatsApp,
    checkConnectionStatus,
    refreshQRCode,
    
    // These are mainly used for testing and debugging
    setConnectionStatus,
    setQrCode
  };
};
