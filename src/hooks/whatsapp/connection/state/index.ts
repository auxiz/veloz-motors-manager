
import { useState } from 'react';
import { ConnectionStatus, ConnectionMetrics } from '../../types';
import { initialConnectionState } from './initialState';
import { UseConnectionStateReturn } from './types';

export const useConnectionState = (): UseConnectionStateReturn => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    initialConnectionState.connectionStatus
  );
  const [qrCode, setQrCode] = useState<string | null>(
    initialConnectionState.qrCode
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    initialConnectionState.isLoading
  );
  const [connectionError, setConnectionError] = useState<string | null>(
    initialConnectionState.connectionError
  );
  const [metrics, setMetrics] = useState<ConnectionMetrics>(
    initialConnectionState.metrics
  );

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
