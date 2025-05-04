
import React, { useState } from 'react';
import { useWhatsAppContext, Lead } from '@/hooks/whatsapp/useWhatsAppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LeadsList: React.FC = () => {
  const { 
    leads, 
    loading, 
    selectLead, 
    selectedLead, 
    fetchLeads, 
    autoRefreshEnabled, 
    toggleAutoRefresh 
  } = useWhatsAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-blue-500';
      case 'contatado': return 'bg-yellow-500';
      case 'interessado': return 'bg-green-500';
      case 'test_drive': return 'bg-purple-500';
      case 'negociando': return 'bg-orange-500';
      case 'convertido': return 'bg-emerald-500';
      case 'perdido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const formatPhone = (phone: string) => {
    if (!phone) return '';
    
    // Try to format as Brazilian phone: (XX) XXXXX-XXXX
    if (phone.length >= 10) {
      const digits = phone.replace(/\D/g, '');
      const match = digits.match(/^(\d{2})(\d{4,5})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    
    return phone;
  };
  
  // Filter leads based on search term and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.phone_number.includes(searchTerm) ||
      lead.first_message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getFirstName = (name: string | null) => {
    if (!name) return '';
    return name.split(' ')[0];
  };
  
  const handleLeadClick = (lead: Lead) => {
    selectLead(lead);
  };
  
  // Translate status for UI display
  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'novo': 'Novo',
      'contatado': 'Contatado',
      'interessado': 'Interessado',
      'test_drive': 'Test Drive',
      'negociando': 'Negociando',
      'convertido': 'Convertido',
      'perdido': 'Perdido'
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return (
    <Card className="h-full bg-veloz-gray border-veloz-gray text-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            Leads
            <Badge className="ml-2 bg-veloz-yellow text-black">{leads.length}</Badge>
          </CardTitle>
          
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 bg-veloz-black border-veloz-black"
                    onClick={toggleAutoRefresh}
                  >
                    {autoRefreshEnabled ? (
                      <Pause size={16} className="text-veloz-yellow" />
                    ) : (
                      <RefreshCw size={16} className="text-veloz-yellow" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {autoRefreshEnabled ? 'Pausar atualização automática' : 'Ativar atualização automática'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 bg-veloz-black border-veloz-black"
                    onClick={() => fetchLeads()}
                    disabled={loading}
                  >
                    <RefreshCw 
                      size={16} 
                      className={`text-white ${loading ? 'animate-spin' : ''}`} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Atualizar agora
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 mt-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar leads..."
              className="pl-8 bg-veloz-black border-veloz-black text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-veloz-black border-veloz-black text-white">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent className="bg-veloz-black text-white">
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="contatado">Contatado</SelectItem>
              <SelectItem value="interessado">Interessado</SelectItem>
              <SelectItem value="test_drive">Test Drive</SelectItem>
              <SelectItem value="negociando">Negociando</SelectItem>
              <SelectItem value="convertido">Convertido</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="overflow-y-auto max-h-[calc(100vh-290px)]">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {searchTerm || statusFilter !== 'all' ? 
              'Nenhum lead corresponde à sua busca' : 
              'Nenhum lead disponível'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLeads.map((lead) => (
              <Button
                key={lead.id}
                variant="ghost"
                className={`w-full justify-start p-3 text-left ${
                  selectedLead?.id === lead.id 
                    ? 'bg-veloz-black border border-veloz-yellow' 
                    : 'hover:bg-veloz-black border border-transparent'
                }`}
                onClick={() => handleLeadClick(lead)}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium truncate max-w-[180px]">
                      {lead.name || formatPhone(lead.phone_number)}
                    </div>
                    <Badge className={`${getStatusColor(lead.status)} text-xs`}>
                      {translateStatus(lead.status)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-400 truncate">
                    {lead.name ? formatPhone(lead.phone_number) : lead.first_message?.substring(0, 30) || 'Sem mensagem'}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsList;
