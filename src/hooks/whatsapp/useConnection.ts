import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ConnectionStatus } from './types';

export const useConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('unknown');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>({
    lastActivity: null,
    reconnectAttempts: 0,
    messageQueueSize: 0
  });

  // Function to connect to WhatsApp
  const connectWhatsApp = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      setConnectionStatus('connecting');
      
      console.log('Initiating WhatsApp connection...');
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: {},
        params: { action: 'connect' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error('Error from Supabase function:', error);
        toast.error('Erro ao conectar ao WhatsApp: ' + error.message);
        setError(error.message);
        setConnectionStatus('disconnected');
        return false;
      }
      
      console.log('Connection response:', data);
      
      if (!data.success) {
        console.error('Connection failed:', data.message);
        toast.error('Falha na conexão: ' + data.message);
        setError(data.message || 'Erro desconhecido');
        setConnectionStatus('disconnected');
        return false;
      }
      
      // Set connection status based on the response
      if (data.isConnected) {
        setConnectionStatus('connected');
        toast.success('WhatsApp conectado com sucesso!');
        return true;
      } else if (data.qrCode) {
        console.log('QR Code received, length:', data.qrCode.length);
        // Validate that we have a proper data URL
        if (typeof data.qrCode === 'string' && data.qrCode.startsWith('data:image')) {
          setQrCode(data.qrCode);
          toast.success('QR Code gerado com sucesso. Escaneie com seu WhatsApp.');
          // Keep status as connecting while waiting for scan
          setConnectionStatus('connecting');
          return true;
        } else {
          console.error('Invalid QR Code format:', typeof data.qrCode);
          toast.error('Formato de QR Code inválido.');
          setError('Formato de QR Code inválido');
          setConnectionStatus('disconnected');
          return false;
        }
      } else {
        console.error('No QR Code or connection status in response');
        toast.error('Resposta inválida do servidor');
        setError('Resposta inválida do servidor');
        setConnectionStatus('disconnected');
        return false;
      }
    } catch (error: any) {
      console.error('Error connecting to WhatsApp:', error);
      toast.error('Erro ao conectar ao WhatsApp: ' + (error.message || error));
      setError(error.message || 'Erro desconhecido');
      setConnectionStatus('disconnected');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to disconnect from WhatsApp
  const disconnectWhatsApp = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: {},
        params: { action: 'disconnect' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error('Error disconnecting from WhatsApp:', error);
        toast.error('Erro ao desconectar do WhatsApp: ' + error.message);
        setError(error.message);
        return false;
      }
      
      if (!data.success) {
        console.error('Disconnection failed:', data.message);
        toast.error('Falha ao desconectar: ' + data.message);
        setError(data.message || 'Erro desconhecido');
        return false;
      }
      
      setConnectionStatus('disconnected');
      setQrCode(null);
      toast.success('Desconectado do WhatsApp');
      
      return true;
    } catch (error: any) {
      console.error('Error disconnecting from WhatsApp:', error);
      toast.error('Erro ao desconectar do WhatsApp: ' + (error.message || error));
      setError(error.message || 'Erro desconhecido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually trigger reconnect
  const reconnectWhatsApp = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      setConnectionStatus('connecting');
      
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: {},
        params: { action: 'reconnect' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error('Error reconnecting WhatsApp:', error);
        toast.error('Erro ao reconectar o WhatsApp: ' + error.message);
        setError(error.message);
        setConnectionStatus('disconnected');
        return false;
      }
      
      if (!data.success) {
        console.error('Reconnection failed:', data.message);
        toast.error('Falha na reconexão: ' + data.message);
        setError(data.message || 'Erro desconhecido');
        setConnectionStatus('disconnected');
        return false;
      }
      
      // Check for QR code in response or update status
      if (data.qrCode) {
        setQrCode(data.qrCode);
      }
      
      if (data.isConnected) {
        setConnectionStatus('connected');
        toast.success('WhatsApp reconectado com sucesso!');
      } else {
        // Keep as connecting until we verify status
        setConnectionStatus('connecting'); 
        toast.info('Tentando reconectar o WhatsApp...');
      }
      
      return true;
    } catch (error: any) {
      console.error('Error reconnecting WhatsApp:', error);
      toast.error('Erro ao reconectar o WhatsApp: ' + (error.message || error));
      setError(error.message || 'Erro desconhecido');
      setConnectionStatus('disconnected');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check connection status
  const checkConnectionStatus = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Checking WhatsApp connection status...');
      
      // First check the database for faster response
      const { data: connectionData, error: connectionError } = await supabase
        .from('whatsapp_connection')
        .select('is_connected, qr_code, last_connected_at, updated_at')
        .maybeSingle();
      
      if (connectionError) {
        console.error('Error fetching connection data from DB:', connectionError);
        // Continue to check with edge function
      } else if (connectionData) {
        console.log('Connection data from DB:', connectionData);
        
        // Update local state with DB data
        setConnectionStatus(connectionData.is_connected ? 'connected' : 'disconnected');
        
        if (connectionData.qr_code && !connectionData.is_connected) {
          console.log('QR code found in database');
          setQrCode(connectionData.qr_code);
        }
      }
      
      // Then check directly with the edge function for real-time status
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: {},
        params: { action: 'status' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error('Error checking status via function:', error);
        setError(error.message);
        // Keep existing status if available, otherwise set to unknown
        if (connectionStatus === 'unknown') {
          setConnectionStatus('unknown');
        }
        return;
      }
      
      console.log('Status response from function:', data);
      
      // Update state based on response
      setConnectionStatus(data.isConnected ? 'connected' : 'disconnected');
      
      // Update QR code if available
      if (data.qrCode && !data.isConnected) {
        setQrCode(data.qrCode);
      } else if (data.isConnected) {
        // Clear QR code if connected
        setQrCode(null);
      }
      
      // Update metrics
      setMetrics({
        lastActivity: data.lastActivity,
        reconnectAttempts: data.reconnectAttempts,
        messageQueueSize: data.messageQueueSize
      });
      
    } catch (error: any) {
      console.error('Error checking connection status:', error);
      setError(error.message || 'Erro ao verificar status');
    } finally {
      setIsLoading(false);
    }
  }, [connectionStatus]);

  // Refresh QR code if needed
  const refreshQRCode = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: {},
        params: { action: 'qrcode' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error('Error refreshing QR code:', error);
        toast.error('Erro ao atualizar QR Code');
        return;
      }
      
      if (data.qrCode) {
        setQrCode(data.qrCode);
        toast.success('QR Code atualizado');
      } else {
        toast.info('QR Code não disponível no momento');
      }
    } catch (error) {
      console.error('Error refreshing QR code:', error);
      toast.error('Erro ao atualizar QR Code');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    connectionStatus,
    qrCode,
    isLoading,
    error,
    metrics,
    connectWhatsApp,
    disconnectWhatsApp,
    reconnectWhatsApp,
    checkConnectionStatus,
    refreshQRCode,
    setConnectionStatus,
    setQrCode
  };
};
