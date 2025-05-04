
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { Loader, RefreshCw, Smartphone, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUsers } from '@/hooks/useUsers';

const WhatsAppConnection: React.FC = () => {
  const { connectionStatus, qrCode, connectWhatsApp, disconnectWhatsApp, checkConnectionStatus } = useWhatsAppContext();
  const { user } = useUsers();
  
  const isAdmin = user?.profile?.role === 'administrator';
  
  const handleConnect = async () => {
    await connectWhatsApp();
  };
  
  const handleDisconnect = async () => {
    await disconnectWhatsApp();
  };
  
  const handleRefresh = async () => {
    await checkConnectionStatus();
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-veloz-gray text-white border-veloz-gray">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <Smartphone className="text-green-500" />
            ) : (
              <WifiOff className="text-red-500" />
            )}
            WhatsApp Connection Status
          </CardTitle>
          <CardDescription className="text-gray-400">
            {connectionStatus === 'connected' && 'WhatsApp is connected and ready to receive messages.'}
            {connectionStatus === 'disconnected' && 'WhatsApp is not connected. Connect to start receiving messages.'}
            {connectionStatus === 'connecting' && 'Connecting to WhatsApp...'}
            {connectionStatus === 'unknown' && 'Checking connection status...'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="mb-4 p-3 bg-veloz-black rounded-md inline-flex items-center">
              <span className={`h-3 w-3 rounded-full mr-2 ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></span>
              <span>
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 'Disconnected'}
              </span>
            </div>
            
            {connectionStatus === 'connecting' && qrCode && (
              <div className="my-4">
                <p className="text-center mb-2">Scan this QR code with WhatsApp on your phone</p>
                <img src={qrCode} alt="WhatsApp QR Code" className="mx-auto max-w-xs" />
              </div>
            )}
            
            {!isAdmin && (
              <Alert className="bg-yellow-900 border-yellow-800 text-white mb-4">
                <AlertTitle>Administrator Access Required</AlertTitle>
                <AlertDescription>
                  Only administrators can connect or disconnect WhatsApp. Contact your administrator for assistance.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4">
          {isAdmin && connectionStatus !== 'connected' && (
            <Button 
              variant="default" 
              className="bg-veloz-yellow text-black hover:bg-yellow-500"
              onClick={handleConnect}
              disabled={connectionStatus === 'connecting'}
            >
              {connectionStatus === 'connecting' ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect WhatsApp'
              )}
            </Button>
          )}
          
          {isAdmin && connectionStatus === 'connected' && (
            <Button 
              variant="destructive" 
              onClick={handleDisconnect}
            >
              Disconnect WhatsApp
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="border-veloz-gray text-white"
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-white space-y-4">
        <h2 className="text-xl font-semibold">How to Connect WhatsApp</h2>
        
        <div className="space-y-2">
          <p>1. Click the "Connect WhatsApp" button above.</p>
          <p>2. Wait for the QR code to appear.</p>
          <p>3. Open WhatsApp on your phone and scan the QR code:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Android: Settings &gt; Linked Devices &gt; Link a Device</li>
            <li>iPhone: Settings &gt; Linked Devices &gt; Link a Device</li>
          </ul>
          <p>4. Once connected, you will start receiving WhatsApp messages in the CRM.</p>
          <p>5. The WhatsApp connection will remain active as long as the server is running.</p>
        </div>
        
        <div className="bg-amber-900 border border-amber-800 p-4 rounded-md">
          <h3 className="font-semibold text-amber-300">Important Notes:</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-white">
            <li>This is an unofficial WhatsApp integration using browser automation.</li>
            <li>WhatsApp does not officially support this type of integration.</li>
            <li>The connection may need to be refreshed occasionally.</li>
            <li>For production use, consider official WhatsApp Business API.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConnection;
