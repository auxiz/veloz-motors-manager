
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useRefreshQRCode = (
  setQrCode: (qrCode: string | null) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  const refreshQRCode = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: { action: 'qrcode' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error('Error refreshing QR code:', error);
        toast.error('Erro ao atualizar QR Code: ' + error.message);
        return;
      }
      
      if (data.success === false) {
        console.error('QR Code refresh failed:', data.message);
        toast.error(data.message || 'Erro ao atualizar QR Code');
        return;
      }
      
      if (data.qrCode) {
        console.log('New QR Code received, length:', data.qrCode.length);
        setQrCode(data.qrCode);
        toast.success('QR Code atualizado com sucesso');
      } else {
        console.warn('No QR Code in response');
        toast.info('QR Code não disponível no momento');
      }
    } catch (error: any) {
      console.error('Error refreshing QR code:', error);
      toast.error('Erro ao atualizar QR Code: ' + (error.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  return { refreshQRCode };
};
