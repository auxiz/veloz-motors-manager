
import { ConnectionStatus, ConnectionMetrics } from '../types';

export interface ConnectionState {
  connectionStatus: ConnectionStatus;
  qrCode: string | null;
  isLoading: boolean;
  connectionError: string | null;
  metrics: ConnectionMetrics;
}

export interface ConnectionActions {
  connectWhatsApp: () => Promise<boolean>;
  disconnectWhatsApp: () => Promise<boolean>;
  reconnectWhatsApp: () => Promise<boolean>;
  checkConnectionStatus: () => Promise<void>;
  refreshQRCode: () => Promise<void>;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setQrCode: (qrCode: string | null) => void;
}

export type UseConnectionReturn = ConnectionState & ConnectionActions;
