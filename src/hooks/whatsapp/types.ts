
export interface Lead {
  id: string;
  name: string | null;
  phone_number: string;
  status: string;
  first_message: string | null;
  assigned_to: string | null;
  created_at: string;
  vehicle_interest: any | null;
  lead_source: string | null;
}

export interface Message {
  id: string;
  lead_id: string;
  message_text: string;
  direction: 'incoming' | 'outgoing';
  sent_by: string | null;
  sent_at: string;
  is_read: boolean;
  media_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface SalespersonCategory {
  id: string;
  user_id: string;
  category_id: string;
  assigned_at: string;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'unknown';

export interface ConnectionMetrics {
  lastActivity: number | null;
  reconnectAttempts: number;
  messageQueueSize: number;
}

export interface ErrorLog {
  id: string;
  error_type: string;
  error_message: string;
  occurred_at: string;
  resolved: boolean;
  resolution_notes?: string | null;
  resolved_at?: string | null;
}

export interface WhatsAppContextType {
  leads: Lead[];
  messages: Message[];
  selectedLead: Lead | null;
  connectionStatus: ConnectionStatus;
  qrCode: string | null;
  isLoading: boolean;
  connectionError?: string | null;
  metrics?: ConnectionMetrics;
  selectLead: (lead: Lead | null) => void;
  fetchLeads: () => void;
  fetchMessages: (leadId: string) => void;
  sendMessage: (phoneNumber: string, message: string, leadId: string) => Promise<boolean>;
  connectWhatsApp: () => Promise<boolean>;
  disconnectWhatsApp: () => Promise<boolean>;
  reconnectWhatsApp: () => Promise<boolean>;
  checkConnectionStatus: () => Promise<void>;
  refreshQRCode: () => Promise<void>;
  updateLead: (leadId: string, updates: Partial<Lead>) => Promise<void>;
  markMessagesAsRead: (leadId: string) => Promise<void>;
  autoRefreshEnabled: boolean;
  toggleAutoRefresh: () => void;
}
