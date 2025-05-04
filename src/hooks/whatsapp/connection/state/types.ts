
import { ConnectionStatus, ConnectionMetrics } from '../../types';

export interface ConnectionState {
  connectionStatus: ConnectionStatus;
  qrCode: string | null;
  isLoading: boolean;
  connectionError: string | null;
  metrics: ConnectionMetrics;
}

export interface ConnectionStateSetters {
  setConnectionStatus: (status: ConnectionStatus) => void;
  setQrCode: (qrCode: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setConnectionError: (error: string | null) => void;
  setMetrics: (metrics: ConnectionMetrics) => void;
}

export type UseConnectionStateReturn = ConnectionState & ConnectionStateSetters;
