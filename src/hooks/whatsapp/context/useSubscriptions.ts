
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '../types';

interface UseSubscriptionsProps {
  userId?: string;
  selectedLead: Lead | null;
  fetchLeads: () => Promise<void>;
  fetchMessages: (leadId: string) => Promise<void>;
  checkConnectionStatus: () => Promise<void>;
}

export const useSubscriptions = ({
  userId,
  selectedLead,
  fetchLeads,
  fetchMessages,
  checkConnectionStatus
}: UseSubscriptionsProps) => {
  
  useEffect(() => {
    if (!userId) {
      console.log('User not logged in, skipping subscriptions setup');
      return;
    }

    console.log('Setting up subscriptions for user:', userId);
    
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
    if (userId) {
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
  }, [userId, selectedLead?.id, fetchLeads, fetchMessages, checkConnectionStatus]);
};
