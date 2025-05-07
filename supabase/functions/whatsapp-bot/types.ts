
// Define all the types used in the WhatsApp bot
export interface WhatsAppClient {
  browser: any;
  page: any;
  isConnected: boolean;
  qrCode: string | null;
  lastActivity: number;
  reconnectAttempts: number;
  messageQueue: MessageQueueItem[];
  sessionData: Record<string, any> | null;
}

export interface MessageQueueItem {
  phoneNumber: string;
  message: string;
  leadId?: string;
  timestamp: number;
  retries?: number;
  userId?: string;
}

export interface ConnectionMetrics {
  lastActivity: number;
  reconnectAttempts: number;
  messageQueueSize: number;
  sessionState?: string;
}

export type EventHandler = (data: any) => Promise<void>;

export interface Config {
  puppeteer: {
    headless: boolean;
    args: string[];
  };
  whatsapp: {
    reconnectInterval: number;
    maxReconnectAttempts: number;
    messageSendDelay: number;
    qrCodeRefreshInterval: number;
  };
  database: {
    connectionTableName: string;
    messagesTableName: string;
    leadsTableName: string;
    errorsTableName: string;
  };
}

export interface ActionHandlers {
  connect: () => Promise<{ success: boolean; qrCode?: string; isConnected?: boolean; message?: string }>;
  disconnect: () => Promise<{ success: boolean; message?: string }>;
  reconnect: () => Promise<{ success: boolean; qrCode?: string; isConnected?: boolean; message?: string }>;
  status: () => Promise<{ isConnected: boolean; qrCode: string | null; lastActivity: number; reconnectAttempts: number; messageQueueSize: number; }>;
  qrcode: () => Promise<{ success: boolean; qrCode?: string; message?: string }>;
  send_message: (data: any) => Promise<{ success: boolean; message?: string }>;
}
