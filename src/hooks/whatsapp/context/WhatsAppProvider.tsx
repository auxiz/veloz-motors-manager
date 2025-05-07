
import React, { createContext } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useLeads } from '../useLeads';
import { useMessages } from '../useMessages';
import { useConnection } from '../useConnection';
import { useWhatsAppActions } from './useWhatsAppActions';
import { useSubscriptions } from './useSubscriptions';
import { useSelectedLead } from './useSelectedLead';
import { WhatsAppContextType, WhatsAppProviderProps } from './types';
import { Lead } from '../types';

export const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<WhatsAppProviderProps> = ({ children }) => {
  const { user } = useUsers();
  
  const { 
    leads, 
    loading: leadsLoading, 
    fetchLeads, 
    updateLead: originalUpdateLead,
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

  // Get wrapped actions with proper return types
  const {
    connectWhatsApp,
    disconnectWhatsApp,
    sendMessage
  } = useWhatsAppActions({
    originalConnectWhatsApp,
    originalDisconnectWhatsApp,
    sendMessageToLead,
    userId: user?.id
  });

  // Adapt updateLead to match the expected signature
  const updateLead = async (lead: Lead): Promise<void> => {
    await originalUpdateLead(lead.id, lead);
  };

  // Handle selected lead
  const { selectedLead, selectLead } = useSelectedLead({
    leads,
    fetchMessages,
    markMessagesAsRead,
    setMessages
  });

  // Set up subscriptions
  useSubscriptions({
    userId: user?.id,
    selectedLead,
    fetchLeads,
    fetchMessages,
    checkConnectionStatus
  });

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
