import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Lead {
  id: string;
  name: string | null;
  phone_number: string;
  status: string;
  first_message: string | null;
  assigned_to: string | null;
  created_at: string;
  vehicle_interest: any | null;
  lead_source: string | null; // Added missing property
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

interface WhatsAppContextType {
  leads: Lead[];
  messages: Message[];
  selectedLead: Lead | null;
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'unknown';
  qrCode: string | null;
  loading: boolean;
  selectLead: (lead: Lead | null) => void;
  fetchLeads: () => void;
  fetchMessages: (leadId: string) => void;
  sendMessage: (phoneNumber: string, message: string, leadId: string) => Promise<boolean>;
  connectWhatsApp: () => Promise<boolean>;
  disconnectWhatsApp: () => Promise<boolean>;
  checkConnectionStatus: () => Promise<void>;
  updateLead: (leadId: string, updates: Partial<Lead>) => Promise<void>;
  markMessagesAsRead: (leadId: string) => Promise<void>;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUsers();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'unknown'>('unknown');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to leads table
    const leadsSubscription = supabase
      .channel('leads-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads' }, 
        (payload) => {
          console.log('Leads change received:', payload);
          fetchLeads();
        }
      )
      .subscribe();

    // Subscribe to messages for the selected lead
    let messagesSubscription: any;
    if (selectedLead) {
      messagesSubscription = supabase
        .channel('messages-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'messages',
            filter: `lead_id=eq.${selectedLead.id}`
          }, 
          (payload) => {
            console.log('Messages change received:', payload);
            fetchMessages(selectedLead.id);
          }
        )
        .subscribe();
    }

    // Subscribe to WhatsApp connection status
    const connectionSubscription = supabase
      .channel('whatsapp-connection-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'whatsapp_connection' }, 
        (payload: any) => {
          console.log('Connection change received:', payload);
          const newData = payload.new;
          setConnectionStatus(newData.is_connected ? 'connected' : 'disconnected');
          if (newData.qr_code) {
            setQrCode(newData.qr_code);
          }
        }
      )
      .subscribe();

    // Check connection status on mount
    checkConnectionStatus();

    // Cleanup subscriptions
    return () => {
      leadsSubscription.unsubscribe();
      if (messagesSubscription) {
        messagesSubscription.unsubscribe();
      }
      connectionSubscription.unsubscribe();
    };
  }, [user, selectedLead?.id]);

  const selectLead = (lead: Lead | null) => {
    setSelectedLead(lead);
    if (lead) {
      fetchMessages(lead.id);
      markMessagesAsRead(lead.id);
    } else {
      setMessages([]);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Use RPC function instead of direct table access
      const { data, error } = await supabase
        .rpc('get_leads', { current_user_id: user?.id || null });
      
      if (error) {
        throw error;
      }
      
      setLeads(data as Lead[]);
      
      // Update selected lead if it exists in the new data
      if (selectedLead) {
        const updatedLead = data.find((lead: Lead) => lead.id === selectedLead.id);
        if (updatedLead) {
          setSelectedLead(updatedLead as Lead);
        }
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (leadId: string) => {
    try {
      setLoading(true);
      // Use RPC function
      const { data, error } = await supabase
        .rpc('get_lead_messages', { p_lead_id: leadId });
        
      if (error) {
        throw error;
      }
      
      setMessages(data as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (phoneNumber: string, message: string, leadId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        method: 'POST',
        body: { phoneNumber, message, leadId },
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user?.id || ''
        },
        path: '/send'
      });
      
      if (error) {
        throw error;
      }
      
      return data.success;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };

  const connectWhatsApp = async (): Promise<boolean> => {
    try {
      setConnectionStatus('connecting');
      
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        method: 'POST',
        body: {},
        path: '/connect'
      });
      
      if (error) {
        throw error;
      }
      
      if (data.qrCode) {
        setQrCode(data.qrCode);
      }
      
      return true;
    } catch (error) {
      console.error('Error connecting to WhatsApp:', error);
      toast.error('Failed to connect to WhatsApp');
      setConnectionStatus('disconnected');
      return false;
    }
  };

  const disconnectWhatsApp = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        method: 'POST',
        body: {},
        path: '/disconnect'
      });
      
      if (error) {
        throw error;
      }
      
      setConnectionStatus('disconnected');
      setQrCode(null);
      
      return true;
    } catch (error) {
      console.error('Error disconnecting from WhatsApp:', error);
      toast.error('Failed to disconnect from WhatsApp');
      return false;
    }
  };

  const checkConnectionStatus = async (): Promise<void> => {
    try {
      // First check the database
      const { data: connectionData, error: connectionError } = await supabase
        .from('whatsapp_connection')
        .select('is_connected, qr_code')
        .maybeSingle();
      
      if (connectionError) {
        throw connectionError;
      }
      
      if (connectionData) {
        setConnectionStatus(connectionData.is_connected ? 'connected' : 'disconnected');
        if (connectionData.qr_code) {
          setQrCode(connectionData.qr_code);
        }
      }
      
      // Then check the edge function
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        method: 'GET',
        path: '/status'
      });
      
      if (error) {
        throw error;
      }
      
      setConnectionStatus(data.isConnected ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('Error checking connection status:', error);
      // Don't show a toast for this as it might be annoying on regular checks
    }
  };

  const updateLead = async (leadId: string, updates: Partial<Lead>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId);
        
      if (error) {
        throw error;
      }
      
      toast.success('Lead updated successfully');
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };

  const markMessagesAsRead = async (leadId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('lead_id', leadId)
        .eq('direction', 'incoming')
        .eq('is_read', false);
        
      if (error) {
        console.error('Error marking messages as read:', error);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchLeads();
      checkConnectionStatus();
    }
  }, [user]);

  const value = {
    leads,
    messages,
    selectedLead,
    connectionStatus,
    qrCode,
    loading,
    selectLead,
    fetchLeads,
    fetchMessages,
    sendMessage,
    connectWhatsApp,
    disconnectWhatsApp,
    checkConnectionStatus,
    updateLead,
    markMessagesAsRead
  };

  return (
    <WhatsAppContext.Provider value={value}>
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsAppContext = () => {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error('useWhatsAppContext must be used within a WhatsAppProvider');
  }
  return context;
};
