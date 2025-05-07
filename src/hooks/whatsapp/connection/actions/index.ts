
import { useConnectWhatsApp } from './useConnectWhatsApp';
import { useDisconnectWhatsApp } from './useDisconnectWhatsApp';
import { useReconnectWhatsApp } from './useReconnectWhatsApp';
import { useCheckConnectionStatus } from './useCheckConnectionStatus';
import { useRefreshQRCode } from './useRefreshQRCode';
import type { ConnectionStateSetters, ConnectionActionsReturn } from './types';

export type { ConnectionStateSetters, ConnectionActionsReturn };

export const useConnectionActions = (
  stateSetters: ConnectionStateSetters
): ConnectionActionsReturn => {
  const { 
    setConnectionStatus, 
    setQrCode, 
    setIsLoading, 
    setConnectionError, 
    setMetrics 
  } = stateSetters;
  
  // Individual action hooks
  const { connectWhatsApp } = useConnectWhatsApp(
    setConnectionStatus,
    setQrCode,
    setIsLoading,
    setConnectionError
  );
  
  const { disconnectWhatsApp } = useDisconnectWhatsApp(
    setConnectionStatus,
    setQrCode,
    setIsLoading,
    setConnectionError
  );
  
  const { reconnectWhatsApp } = useReconnectWhatsApp(
    setConnectionStatus,
    setQrCode,
    setIsLoading,
    setConnectionError
  );
  
  const { checkConnectionStatus } = useCheckConnectionStatus(
    setConnectionStatus,
    setQrCode,
    setIsLoading,
    setConnectionError,
    setMetrics
  );
  
  const { refreshQRCode } = useRefreshQRCode(
    setQrCode,
    setIsLoading
  );

  return {
    connectWhatsApp,
    disconnectWhatsApp,
    reconnectWhatsApp,
    checkConnectionStatus,
    refreshQRCode
  };
};
