
import { WhatsAppClient } from './types';

// Global WhatsApp client state
export const whatsAppClient: WhatsAppClient = {
  browser: null,
  page: null,
  isConnected: false,
  qrCode: null,
  lastActivity: Date.now(),
  reconnectAttempts: 0,
  messageQueue: [],
  sessionData: null,
};
