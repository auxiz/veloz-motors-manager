
import { ConnectionStatus, ConnectionMetrics } from '../../types';

export type ConnectionStateSetters = {
  setConnectionStatus: (status: ConnectionStatus) => void;
  setQrCode: (qrCode: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setConnectionError: (error: string | null) => void;
  setMetrics: (metrics: ConnectionMetrics) => void;
};

export interface ConnectionActionsReturn {
  connectWhatsApp: () => Promise<boolean>;
  disconnectWhatsApp: () => Promise<boolean>;
  reconnectWhatsApp: () => Promise<boolean>;
  checkConnectionStatus: () => Promise<void>;
  refreshQRCode: () => Promise<void>;
}
