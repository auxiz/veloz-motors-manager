
import React from 'react';
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
  return (
    <div className="my-4 flex flex-col items-center p-4 bg-white rounded-lg w-full max-w-xs mx-auto">
      <div className="flex items-center mb-2 text-black">
        <QrCode className="mr-2 text-black" size={20} />
        <p className="font-medium">Escaneie este QR code com WhatsApp</p>
      </div>
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
      <div className="mt-2 flex flex-col items-center text-center">
        <p className="text-sm text-black mb-2">O QR Code expirará após alguns minutos</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-1 text-black border-black hover:bg-gray-100"
          onClick={onRefreshQR}
          disabled={isLoading}
        >
          <RefreshCw className="mr-1 h-4 w-4" />
          Atualizar QR Code
        </Button>
      </div>
    </div>
  );
};
