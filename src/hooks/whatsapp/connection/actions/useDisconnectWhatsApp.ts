
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ConnectionStatus } from '../../types';

export const useDisconnectWhatsApp = (
  setConnectionStatus: (status: ConnectionStatus) => void,
  setQrCode: (qrCode: string | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  setConnectionError: (error: string | null) => void
) => {
  const disconnectWhatsApp = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setConnectionError(null);
      
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: { action: 'disconnect' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error('Error disconnecting from WhatsApp:', error);
        toast.error('Erro ao desconectar do WhatsApp: ' + error.message);
        setConnectionError(error.message);
        return false;
      }
      
      if (!data.success) {
        console.error('Disconnection failed:', data.message);
        toast.error('Falha ao desconectar: ' + data.message);
        setConnectionError(data.message || 'Erro desconhecido');
        return false;
      }
      
      setConnectionStatus('disconnected');
      setQrCode(null);
      toast.success('Desconectado do WhatsApp');
      
      return true;
    } catch (error: any) {
      console.error('Error disconnecting from WhatsApp:', error);
      toast.error('Erro ao desconectar do WhatsApp: ' + (error.message || error));
      setConnectionError(error.message || 'Erro desconhecido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { disconnectWhatsApp };
};
