import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ConnectionStatus } from '../../types';

export const useConnectWhatsApp = (
  setConnectionStatus: (status: ConnectionStatus) => void,
  setQrCode: (qrCode: string | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  setConnectionError: (error: string | null) => void
) => {
  const connectWhatsApp = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setConnectionError(null);
      setConnectionStatus('connecting');
      
      console.log('Initiating WhatsApp connection...');
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: { action: 'connect' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error('Error from Supabase function:', error);
        toast.error('Erro ao conectar ao WhatsApp: ' + error.message);
        setConnectionError(error.message);
        setConnectionStatus('disconnected');
        return false;
      }
      
      console.log('Connection response:', data);
      
      if (!data.success) {
        console.error('Connection failed:', data.message);
        toast.error('Falha na conexão: ' + data.message);
        setConnectionError(data.message || 'Erro desconhecido');
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
          setConnectionError('Formato de QR Code inválido');
          setConnectionStatus('disconnected');
          return false;
        }
      } else {
        console.error('No QR Code or connection status in response');
        toast.error('Resposta inválida do servidor');
        setConnectionError('Resposta inválida do servidor');
        setConnectionStatus('disconnected');
        return false;
      }
    } catch (error: any) {
      console.error('Error connecting to WhatsApp:', error);
      toast.error('Erro ao conectar ao WhatsApp: ' + (error.message || error));
      setConnectionError(error.message || 'Erro desconhecido');
      setConnectionStatus('disconnected');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { connectWhatsApp };
};
