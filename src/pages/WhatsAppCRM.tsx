
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthGuard } from '@/components/auth/AuthGuard';
import WhatsAppConnection from '@/components/whatsapp/WhatsAppConnection';
import LeadsList from '@/components/whatsapp/LeadsList';
import MessagesPanel from '@/components/whatsapp/MessagesPanel';
import SalespeopleSettings from '@/components/whatsapp/SalespeopleSettings';
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { Separator } from '@/components/ui/separator';

const WhatsAppCRM = () => {
  const { selectedLead } = useWhatsAppContext();
  
  return (
    <AuthGuard allowedRoles={['administrator', 'seller']}>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-veloz-white">WhatsApp CRM</h1>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="w-full justify-start bg-veloz-gray">
            <TabsTrigger value="leads" className="text-white">
              Leads
            </TabsTrigger>
            <TabsTrigger value="connection" className="text-white">
              WhatsApp Connection
            </TabsTrigger>
            <TabsTrigger value="salespeople" className="text-white">
              Salespeople
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
                    <p className="text-gray-400">Select a lead to view conversation</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="connection" className="p-4 mt-4 bg-veloz-black border border-veloz-gray rounded-md">
            <WhatsAppConnection />
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
