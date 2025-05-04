import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ConnectionStatus } from '../../types';

export const useReconnectWhatsApp = (
  setConnectionStatus: (status: ConnectionStatus) => void,
  setQrCode: (qrCode: string | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  setConnectionError: (error: string | null) => void
) => {
  const reconnectWhatsApp = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setConnectionError(null);
      setConnectionStatus('connecting');
      
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: { action: 'reconnect' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error('Error reconnecting WhatsApp:', error);
        toast.error('Erro ao reconectar o WhatsApp: ' + error.message);
        setConnectionError(error.message);
        setConnectionStatus('disconnected');
        return false;
      }
      
      if (!data.success) {
        console.error('Reconnection failed:', data.message);
        toast.error('Falha na reconexão: ' + data.message);
        setConnectionError(data.message || 'Erro desconhecido');
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
      setConnectionError(error.message || 'Erro desconhecido');
      setConnectionStatus('disconnected');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { reconnectWhatsApp };
};
