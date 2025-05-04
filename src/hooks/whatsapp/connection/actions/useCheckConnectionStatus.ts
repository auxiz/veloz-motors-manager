
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ConnectionStatus } from '../../types';

export const useCheckConnectionStatus = (
  setConnectionStatus: (status: ConnectionStatus) => void,
  setQrCode: (qrCode: string | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  setConnectionError: (error: string | null) => void,
  setMetrics: (metrics: any) => void
) => {
  const checkConnectionStatus = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Checking WhatsApp connection status...');
      
      // First check the database for faster response
      const { data: connectionData, error: connectionError } = await supabase
        .from('whatsapp_connection')
        .select('is_connected, qr_code, last_connected_at, updated_at, reconnect_attempts, last_error, last_error_at')
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
        
        // Update metrics with DB data
        setMetrics(prev => ({
          ...prev,
          reconnectAttempts: connectionData.reconnect_attempts || 0,
          lastError: connectionData.last_error,
          lastErrorAt: connectionData.last_error_at
        }));
      }
      
      // Then check directly with the edge function for real-time status
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: { action: 'status' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error('Error checking status via function:', error);
        setConnectionError(error.message);
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
      setConnectionError(error.message || 'Erro ao verificar status');
    } finally {
      setIsLoading(false);
    }
  }, [setConnectionStatus, setQrCode, setIsLoading, setConnectionError, setMetrics]);

  return { checkConnectionStatus };
};
