
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ConnectionStatus } from './types';

export const useConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('unknown');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const connectWhatsApp = async (): Promise<boolean> => {
    try {
      setConnectionStatus('connecting');
      
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: { action: 'connect' },
        headers: {
          'Content-Type': 'application/json'
        }
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
      toast.error('Falha ao conectar ao WhatsApp');
      setConnectionStatus('disconnected');
      return false;
    }
  };

  const disconnectWhatsApp = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: { action: 'disconnect' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        throw error;
      }
      
      setConnectionStatus('disconnected');
      setQrCode(null);
      
      return true;
    } catch (error) {
      console.error('Error disconnecting from WhatsApp:', error);
      toast.error('Falha ao desconectar do WhatsApp');
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
        body: { action: 'status' },
        headers: {
          'Content-Type': 'application/json'
        }
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

  return {
    connectionStatus,
    qrCode,
    connectWhatsApp,
    disconnectWhatsApp,
    checkConnectionStatus,
    setConnectionStatus,
    setQrCode
  };
};
