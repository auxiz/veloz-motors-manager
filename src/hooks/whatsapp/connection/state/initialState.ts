
import { ConnectionStatus, ConnectionMetrics } from '../../types';

export const initialConnectionState = {
  connectionStatus: 'unknown' as ConnectionStatus,
  qrCode: null as string | null,
  isLoading: false,
  connectionError: null as string | null,
  metrics: {
    lastActivity: null,
    reconnectAttempts: 0,
    messageQueueSize: 0
  } as ConnectionMetrics
};
