
import React, { useEffect, useState } from 'react';
import { QrCode, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  qrCode: string;
  onRefreshQR: () => Promise<void>;
  isLoading: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCode,
  onRefreshQR,
  isLoading
}) => {
  const [countdown, setCountdown] = useState<number>(25);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  // Reset state when qrCode changes
  useEffect(() => {
    if (qrCode) {
      setCountdown(25);
      setImageError(false);
    }
  }, [qrCode]);
  
  // Log QR code info for debugging
  useEffect(() => {
    console.log("QR Code available:", !!qrCode, "length:", qrCode?.length || 0);
    
    if (!qrCode?.startsWith('data:image')) {
      console.error("Invalid QR code format:", qrCode?.substring(0, 20));
    }
    
    // Set up automatic refresh countdown timer (QR codes typically expire after 20-30 seconds)
    let countdownInterval: number | undefined;
    
    if (autoRefresh && qrCode) {
      countdownInterval = window.setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Refresh when countdown reaches zero
            console.log("QR Code expired, refreshing...");
            void onRefreshQR();
            return 25; // Reset countdown
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [qrCode, onRefreshQR, autoRefresh]);

  const handleRefresh = async () => {
    try {
      setImageError(false);
      await onRefreshQR();
    } catch (error) {
      console.error("Error refreshing QR code:", error);
      toast.error("Erro ao atualizar o QR code");
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
    toast.info(autoRefresh ? "Atualização automática desativada" : "Atualização automática ativada");
  };

  return (
    <div className="my-4 flex flex-col items-center p-4 bg-white rounded-lg w-full max-w-xs mx-auto">
      <div className="flex items-center mb-2 text-black">
        <QrCode className="mr-2 text-black" size={20} />
        <p className="font-medium">Escaneie este QR code com WhatsApp</p>
      </div>
      
      {qrCode?.startsWith('data:image') ? (
        <div className="p-3 bg-white rounded-lg shadow-md">
          <img 
            src={qrCode} 
            alt="WhatsApp QR Code" 
            className="mx-auto max-w-full h-auto"
            onError={(e) => {
              console.error('Error loading QR code image');
              setImageError(true);
              e.currentTarget.style.display = 'none';
            }}
            style={{ display: imageError ? 'none' : 'block' }}
          />
          {imageError && (
            <div className="h-[200px] w-[200px] flex items-center justify-center">
              <p className="text-red-500 text-center">Erro ao carregar QR code</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-white rounded-lg shadow-md flex items-center justify-center h-[200px] w-[200px]">
          <p className="text-red-500 text-center">QR code inválido</p>
        </div>
      )}
      
      <div className="mt-2 flex flex-col items-center text-center">
        <p className="text-sm text-black mb-1">
          {autoRefresh 
            ? `O QR Code atualizará em ${countdown}s` 
            : 'Atualização automática desativada'}
        </p>
        
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-black border-black hover:bg-gray-100"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Atualizando...' : 'Atualizar QR'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={`${autoRefresh ? 'bg-gray-200' : ''} text-black border-black hover:bg-gray-100`}
            onClick={toggleAutoRefresh}
          >
            {autoRefresh ? 'Desativar Auto' : 'Ativar Auto'}
          </Button>
        </div>
      </div>
    </div>
  );
};
