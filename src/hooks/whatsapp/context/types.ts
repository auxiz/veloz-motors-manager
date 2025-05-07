
import { ReactNode } from 'react';
import { Lead, Message, ConnectionStatus, ConnectionMetrics } from '../types';

export interface WhatsAppProviderProps {
  children: ReactNode;
}

export interface WhatsAppContextState {
  leads: Lead[];
  messages: Message[];
  selectedLead: Lead | null;
  connectionStatus: ConnectionStatus;
  qrCode: string | null;
  isLoading: boolean;
  connectionError: string | null;
  metrics: ConnectionMetrics;
  autoRefreshEnabled: boolean;
  error: string | null;
}

export interface WhatsAppContextActions {
  selectLead: (lead: Lead | null) => void;
  fetchLeads: () => Promise<void>;
  fetchMessages: (leadId: string) => Promise<void>;
  sendMessage: (phoneNumber: string, message: string, leadId: string) => Promise<void>;
  connectWhatsApp: () => Promise<void>;
  disconnectWhatsApp: () => Promise<void>;
  reconnectWhatsApp: () => Promise<void>;
  checkConnectionStatus: () => Promise<void>;
  refreshQRCode: () => Promise<void>;
  updateLead: (lead: Lead) => Promise<void>;
  markMessagesAsRead: (leadId: string) => Promise<void>;
  toggleAutoRefresh: () => void;
}

export type WhatsAppContextType = WhatsAppContextState & WhatsAppContextActions;
