
import React from 'react';
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { LeadsHeader } from './LeadsHeader';
import { LeadItem } from './LeadItem';
import { useLeadUtils } from './hooks/useLeadUtils';

const LeadsList: React.FC = () => {
  const {
    leads,
    selectedLead,
    selectLead,
    fetchLeads,
    isLoading
  } = useWhatsAppContext();
  
  const {
    formatDate,
    hasUnreadMessages,
    getStatusColor
  } = useLeadUtils();

  return (
    <div className="h-full">
      <Card className="bg-veloz-black border-veloz-gray h-full">
        <CardHeader className="pb-2">
          <LeadsHeader
            leadsCount={leads.length}
            isLoading={isLoading}
            fetchLeads={fetchLeads}
          />
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(100vh-220px)]">
          {isLoading && leads.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <RefreshCw className="animate-spin h-6 w-6 text-veloz-yellow" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Nenhum lead encontrado
            </div>
          ) : (
            <ul className="space-y-2">
              {leads.map(lead => (
                <LeadItem
                  key={lead.id}
                  lead={lead}
                  selectedLeadId={selectedLead?.id || null}
                  selectLead={selectLead}
                  formatDate={formatDate}
                  hasUnreadMessages={hasUnreadMessages}
                  getStatusColor={getStatusColor}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsList;
