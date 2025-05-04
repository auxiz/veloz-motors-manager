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
    toggleAutoRefresh,
    error: leadsError 
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
    isLoading: connectionLoading,
    connectionError,
    metrics,
    connectWhatsApp: originalConnectWhatsApp, 
    disconnectWhatsApp: originalDisconnectWhatsApp,
    reconnectWhatsApp,
    checkConnectionStatus,
    refreshQRCode
  } = useConnection();

  // Wrap the connection functions to adapt the return type
  const connectWhatsApp = async (): Promise<void> => {
    await originalConnectWhatsApp();
  };
  
  const disconnectWhatsApp = async (): Promise<void> => {
    await originalDisconnectWhatsApp();
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) {
      console.log('User not logged in, skipping subscriptions setup');
      return;
    }

    console.log('Setting up subscriptions for user:', user.id);

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
          
          // Check if the connection status has changed
          if (newData && newData.is_connected !== undefined) {
            console.log('Connection status changed in database:', newData.is_connected);
            checkConnectionStatus();
          }
          
          // Check if QR code has changed
          if (newData && newData.qr_code !== undefined && newData.qr_code !== null) {
            console.log('QR code updated in database');
            checkConnectionStatus();
          }
        }
      )
      .subscribe();

    // Only check connection status if user is logged in
    if (user) {
      console.log('Checking initial connection status');
      checkConnectionStatus();
    }

    // Cleanup subscriptions
    return () => {
      console.log('Cleaning up subscriptions');
      leadsSubscription.unsubscribe();
      if (messagesSubscription) {
        messagesSubscription.unsubscribe();
      }
      connectionSubscription.unsubscribe();
    };
  }, [user?.id, selectedLead?.id]);

  const selectLead = (lead: Lead | null) => {
    setSelectedLead(lead);
    if (lead) {
      fetchMessages(lead.id);
      markMessagesAsRead(lead.id);
    } else {
      setMessages([]);
    }
  };

  // Updated to match the Promise<void> return type in WhatsAppContextType
  const sendMessage = async (phoneNumber: string, message: string, leadId: string): Promise<void> => {
    await sendMessageToLead(phoneNumber, message, leadId, user?.id);
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

  const loading = leadsLoading || messagesLoading || connectionLoading;

  const value: WhatsAppContextType = {
    leads,
    messages,
    selectedLead,
    connectionStatus,
    qrCode,
    isLoading: loading,
    connectionError,
    metrics,
    selectLead,
    fetchLeads,
    fetchMessages,
    sendMessage,
    connectWhatsApp,
    disconnectWhatsApp,
    reconnectWhatsApp,
    checkConnectionStatus,
    refreshQRCode,
    updateLead,
    markMessagesAsRead,
    autoRefreshEnabled,
    toggleAutoRefresh,
    error: leadsError
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
