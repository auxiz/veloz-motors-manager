
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/hooks/whatsapp/types';

interface LeadItemProps {
  lead: Lead;
  selectedLeadId: string | null;
  selectLead: (lead: Lead) => void;
  formatDate: (dateString: string) => string;
  hasUnreadMessages: (leadId: string) => boolean;
  getStatusColor: (status: string) => string;
}

export const LeadItem: React.FC<LeadItemProps> = ({
  lead,
  selectedLeadId,
  selectLead,
  formatDate,
  hasUnreadMessages,
  getStatusColor
}) => {
  return (
    <li 
      className={`p-3 rounded-md cursor-pointer transition-colors ${
        selectedLeadId === lead.id 
          ? 'bg-veloz-yellow bg-opacity-20 border border-veloz-yellow' 
          : 'bg-veloz-gray hover:bg-veloz-gray-hover'
      }`} 
      onClick={() => selectLead(lead)}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-white">
              {lead.name || lead.phone_number}
            </h3>
            {hasUnreadMessages(lead.id) && (
              <Badge className="ml-2 bg-veloz-yellow text-black">Novo</Badge>
            )}
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
      {lead.first_message && (
        <p className="mt-2 text-sm text-gray-300 line-clamp-2">
          {lead.first_message}
        </p>
      )}
    </li>
  );
};
