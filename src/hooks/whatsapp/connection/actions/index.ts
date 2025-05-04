
import { useConnectWhatsApp } from './useConnectWhatsApp';
import { useDisconnectWhatsApp } from './useDisconnectWhatsApp';
import { useReconnectWhatsApp } from './useReconnectWhatsApp';
import { useCheckConnectionStatus } from './useCheckConnectionStatus';
import { useRefreshQRCode } from './useRefreshQRCode';
import { ConnectionStatus, ConnectionMetrics } from '../../types';

export type ConnectionStateSetters = {
  setConnectionStatus: (status: ConnectionStatus) => void;
  setQrCode: (qrCode: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setConnectionError: (error: string | null) => void;
  setMetrics: (metrics: ConnectionMetrics) => void;
};

export const useConnectionActions = ({
  setConnectionStatus,
  setQrCode,
  setIsLoading,
  setConnectionError,
  setMetrics
}: ConnectionStateSetters) => {
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
