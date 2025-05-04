
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { supabase } from '@/integrations/supabase/client';
import { useLeads } from './useLeads';
import { useMessages } from './useMessages';
import { useConnection } from './useConnection';
import { 
  Lead,
  Message,
  WhatsAppContextType
} from './types';

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUsers();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const { 
    leads, 
    loading: leadsLoading, 
    fetchLeads, 
    updateLead,
    setLeads,
    autoRefreshEnabled,
    toggleAutoRefresh 
  } = useLeads(user?.id);
  
  const { 
    messages, 
    loading: messagesLoading, 
    fetchMessages, 
    sendMessage: sendMessageToLead, 
    markMessagesAsRead,
    setMessages 
  } = useMessages();
  
  const { 
    connectionStatus, 
    qrCode, 
    connectWhatsApp, 
    disconnectWhatsApp, 
    checkConnectionStatus 
  } = useConnection();

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
          if (newData?.is_connected !== undefined) {
            const newStatus = newData.is_connected ? 'connected' : 'disconnected';
            if (newStatus !== connectionStatus) {
              checkConnectionStatus();
            }
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

  const sendMessage = async (phoneNumber: string, message: string, leadId: string): Promise<boolean> => {
    return sendMessageToLead(phoneNumber, message, leadId, user?.id);
  };

  // Update selected lead if it exists in the new data after fetching leads
  useEffect(() => {
    if (selectedLead) {
      const updatedLead = leads.find((lead) => lead.id === selectedLead.id);
      if (updatedLead) {
        setSelectedLead(updatedLead);
      }
    }
  }, [leads]);

  const loading = leadsLoading || messagesLoading;

  const value: WhatsAppContextType = {
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
    markMessagesAsRead,
    autoRefreshEnabled,
    toggleAutoRefresh
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

// Re-exporting types for easier access
export type { Lead, Message } from './types';
