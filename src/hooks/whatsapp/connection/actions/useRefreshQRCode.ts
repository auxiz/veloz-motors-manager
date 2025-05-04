
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

  return { refreshQRCode };
};
