import React, { useEffect } from 'react';
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
const LeadsList: React.FC = () => {
  const {
    leads,
    selectedLead,
    selectLead,
    fetchLeads,
    isLoading,
    autoRefreshEnabled,
    toggleAutoRefresh
  } = useWhatsAppContext();
  useEffect(() => {
    fetchLeads();
  }, []);
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-500';
      case 'contacted':
        return 'bg-yellow-500';
      case 'qualified':
        return 'bg-green-500';
      case 'unqualified':
        return 'bg-red-500';
      case 'converted':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  const hasUnreadMessages = (leadId: string) => {
    // Check if this lead has any unread messages
    return leads.some(lead => lead.id === leadId && lead.status === 'new');
  };
  return <div className="h-full">
      <Card className="bg-veloz-black border-veloz-gray h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">Leads</CardTitle>
            <div className="flex space-x-2">
              
              <Button variant="outline" size="sm" onClick={() => fetchLeads()} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <CardDescription className="text-gray-400">
            {leads.length} leads encontrados
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(100vh-220px)]">
          {isLoading && leads.length === 0 ? <div className="flex justify-center items-center h-32">
              <RefreshCw className="animate-spin h-6 w-6 text-veloz-yellow" />
            </div> : leads.length === 0 ? <div className="text-center py-8 text-gray-400">
              Nenhum lead encontrado
            </div> : <ul className="space-y-2">
              {leads.map(lead => <li key={lead.id} className={`p-3 rounded-md cursor-pointer transition-colors ${selectedLead?.id === lead.id ? 'bg-veloz-yellow bg-opacity-20 border border-veloz-yellow' : 'bg-veloz-gray hover:bg-veloz-gray-hover'}`} onClick={() => selectLead(lead)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-white">
                          {lead.name || lead.phone_number}
                        </h3>
                        {hasUnreadMessages(lead.id) && <Badge className="ml-2 bg-veloz-yellow text-black">Novo</Badge>}
                      </div>
                      <p className="text-sm text-gray-400">{lead.phone_number}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(lead.created_at)}
                      </p>
                    </div>
                    <div>
                      <Badge className={`${getStatusColor(lead.status)} text-white`}>
                        {lead.status}
                      </Badge>
                    </div>
                  </div>
                  {lead.first_message && <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                      {lead.first_message}
                    </p>}
                </li>)}
            </ul>}
        </CardContent>
      </Card>
    </div>;
};
export default LeadsList;