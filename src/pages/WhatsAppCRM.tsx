
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthGuard } from '@/components/auth/AuthGuard';
import WhatsAppConnection from '@/components/whatsapp/WhatsAppConnection';
import WhatsAppMetrics from '@/components/whatsapp/WhatsAppMetrics';
import { LeadsList } from '@/components/whatsapp/leads';
import MessagesPanel from '@/components/whatsapp/MessagesPanel';
import SalespeopleSettings from '@/components/whatsapp/SalespeopleSettings';
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const WhatsAppCRM = () => {
  const { selectedLead, connectionStatus, checkConnectionStatus } = useWhatsAppContext();
  const [activeTab, setActiveTab] = useState("leads");
  
  // Initial connection check
  useEffect(() => {
    checkConnectionStatus().catch(error => {
      console.error("Error checking connection status:", error);
      toast.error("Erro ao verificar status da conexão");
    });
  }, []);
  
  // Auto-switch to connection tab if disconnected
  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      setActiveTab('connection');
      toast.info("WhatsApp desconectado. Por favor, verifique a conexão.");
    } else if (connectionStatus === 'connecting' && activeTab !== 'connection') {
      toast.info("WhatsApp se conectando...");
    }
  }, [connectionStatus]);
  
  return (
    <AuthGuard allowedRoles={['administrator', 'seller']}>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-veloz-white">WhatsApp CRM</h1>
          <div className="flex items-center">
            <span className={`inline-block h-3 w-3 rounded-full mr-2 ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}></span>
            <span className="text-sm text-veloz-white">
              {connectionStatus === 'connected' ? 'Conectado' : 
               connectionStatus === 'connecting' ? 'Conectando...' : 
               'Desconectado'}
            </span>
          </div>
        </div>
        
        <Separator />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-veloz-gray">
            <TabsTrigger value="leads" className="text-white">
              Leads
            </TabsTrigger>
            <TabsTrigger value="connection" className="text-white">
              Conexão WhatsApp
              {connectionStatus === 'disconnected' && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  !
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="metrics" className="text-white">
              Diagnósticos
            </TabsTrigger>
            <TabsTrigger value="salespeople" className="text-white">
              Vendedores
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads" className="p-4 mt-4 bg-veloz-black border border-veloz-gray rounded-md">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <LeadsList />
              </div>
              <div className="lg:col-span-2">
                {selectedLead ? (
                  <MessagesPanel />
                ) : (
                  <div className="flex items-center justify-center h-96 bg-veloz-black rounded-md border border-veloz-gray">
                    <p className="text-gray-400">Selecione um lead para visualizar a conversa</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="connection" className="p-4 mt-4 bg-veloz-black border border-veloz-gray rounded-md">
            <WhatsAppConnection />
          </TabsContent>
          
          <TabsContent value="metrics" className="p-4 mt-4 bg-veloz-black border border-veloz-gray rounded-md">
            <WhatsAppMetrics />
          </TabsContent>
          
          <TabsContent value="salespeople" className="p-4 mt-4 bg-veloz-black border border-veloz-gray rounded-md">
            <SalespeopleSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
};

export default WhatsAppCRM;
