
import { useState } from 'react';
import { ConnectionStatus, ConnectionMetrics } from '../types';

export const useConnectionState = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('unknown');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ConnectionMetrics>({
    lastActivity: null,
    reconnectAttempts: 0,
    messageQueueSize: 0
  });

  return {
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
  };
};
