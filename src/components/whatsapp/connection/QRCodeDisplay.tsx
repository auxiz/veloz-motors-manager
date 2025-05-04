
import React, { useEffect } from 'react';
import { QrCode, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  // Log QR code info for debugging
  useEffect(() => {
    console.log("QR Code available:", !!qrCode, "length:", qrCode?.length || 0);
    
    if (!qrCode?.startsWith('data:image')) {
      console.error("Invalid QR code format:", qrCode?.substring(0, 20));
    }
    
    // Set up automatic refresh timer (QR codes typically expire after 20-30 seconds)
    const refreshTimer = setTimeout(() => {
      console.log("QR Code may be expired, refreshing...");
      onRefreshQR();
    }, 25000); // Refresh after 25 seconds
    
    return () => clearTimeout(refreshTimer);
  }, [qrCode, onRefreshQR]);

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
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="p-3 bg-white rounded-lg shadow-md flex items-center justify-center h-[200px] w-[200px]">
          <p className="text-red-500 text-center">Invalid QR code format</p>
        </div>
      )}
      <div className="mt-2 flex flex-col items-center text-center">
        <p className="text-sm text-black mb-2">O QR Code expirará após alguns minutos</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-1 text-black border-black hover:bg-gray-100"
          onClick={onRefreshQR}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Atualizando...' : 'Atualizar QR Code'}
        </Button>
      </div>
    </div>
  );
};
