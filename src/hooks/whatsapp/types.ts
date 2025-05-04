
// Define and export the ConnectionStatus type
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'unknown';

// Define and export ConnectionMetrics
export interface ConnectionMetrics {
  lastActivity: string | null;
  reconnectAttempts: number;
  messageQueueSize: number;
}

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

export interface Lead {
  id: string;
  created_at: string;
  name: string | null;
  phone_number: string;
  first_message: string | null;
  status: string;
  assigned_to: string | null;
}

export interface Message {
  id: string;
  created_at: string;
  lead_id: string;
  message_text: string;
  direction: 'incoming' | 'outgoing';
  sent_by: string | null;
  is_read: boolean;
  sent_at: string; // Added this field to fix the error
  media_url?: string;  // Optional field from the DB
}

export interface ErrorLog {
  id: string;
  occurred_at: string;
  error_type: string;
  error_message: string;
  resolved: boolean;
  resolved_at?: string | null;
  resolution_notes?: string | null;
}

export interface WhatsAppContextType {
  leads: Lead[];
  messages: Message[];
  selectedLead: Lead | null;
  connectionStatus: ConnectionStatus;
  qrCode: string | null;
  isLoading: boolean;
  connectionError: string | null;
  metrics: ConnectionMetrics;
  error: string | null;
  selectLead: (lead: Lead | null) => void;
  fetchLeads: () => Promise<void>;
  fetchMessages: (leadId: string) => Promise<void>;
  sendMessage: (phoneNumber: string, message: string, leadId: string) => Promise<void>; // Updated to return Promise<void>
  connectWhatsApp: () => Promise<void>;
  disconnectWhatsApp: () => Promise<void>;
  reconnectWhatsApp: () => Promise<void>;
  checkConnectionStatus: () => Promise<void>;
  refreshQRCode: () => Promise<void>;
  updateLead: (leadId: string, updates: Partial<Lead>) => Promise<void>;
  markMessagesAsRead: (leadId: string) => Promise<void>;
  autoRefreshEnabled: boolean;
  toggleAutoRefresh: () => void;
}
