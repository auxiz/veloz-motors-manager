
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ConnectionStatus, ConnectionMetrics } from '../../types';

export const useCheckConnectionStatus = (
  setConnectionStatus: (status: ConnectionStatus) => void,
  setQrCode: (qrCode: string | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  setConnectionError: (error: string | null) => void,
  setMetrics: (metrics: ConnectionMetrics) => void
) => {
  const checkConnectionStatus = async (): Promise<void> => {
    try {
      // First try to fetch connection data from the database
      const { data: dbData, error: dbError } = await supabase
        .from('whatsapp_connection')
        .select('*')
        .limit(1)
        .single();
      
      if (dbError) {
        console.error('Error fetching connection data from DB:', dbError);
        // Don't throw error here, try the edge function instead
      } else {
        // If we have DB data, use it
        if (dbData) {
          setConnectionStatus(dbData.is_connected ? 'connected' : 'disconnected');
          setQrCode(dbData.qr_code);
          setConnectionError(null);
          console.log('Connection status from DB:', dbData.is_connected ? 'connected' : 'disconnected');
          return;
        }
      }
      
      // If DB data is not available, try the edge function
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('whatsapp-bot', {
        body: { action: 'status' }
      });
      
      if (edgeError) {
        console.error('Error checking connection status:', edgeError);
        setConnectionError(`Error checking status: ${edgeError.message}`);
        // Don't change connection status here
        return;
      }
      
      if (edgeData) {
        setConnectionStatus(edgeData.isConnected ? 'connected' : 'disconnected');
        
        if (edgeData.qrCode) {
          setQrCode(edgeData.qrCode);
        }
        
        if (edgeData.lastActivity || edgeData.reconnectAttempts !== undefined || edgeData.messageQueueSize !== undefined) {
          setMetrics({
            lastActivity: edgeData.lastActivity,
            reconnectAttempts: edgeData.reconnectAttempts || 0,
            messageQueueSize: edgeData.messageQueueSize || 0
          });
        }
        
        setConnectionError(null);
      } else {
        // No data returned, assume disconnected
        setConnectionStatus('disconnected');
        setConnectionError('Could not determine connection status');
      }
    } catch (error: any) {
      console.error('Error checking connection status:', error);
      setConnectionError(`Error checking status: ${error.message}`);
      // Don't change connection status here
    } finally {
      setIsLoading(false);
    }
  };

  return { checkConnectionStatus };
};
