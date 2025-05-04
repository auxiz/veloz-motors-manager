
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Lead } from '@/hooks/whatsapp/useWhatsAppContext';

interface MessageHeaderProps {
  lead: Lead | null;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({ lead }) => {
  return (
    <div className="pb-2 border-b border-veloz-gray">
      <div className="text-lg text-white flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={null} />
          <AvatarFallback className="bg-veloz-yellow text-black">
            {lead?.name ? lead.name.charAt(0).toUpperCase() : 'L'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div>{lead?.name || 'Lead sem nome'}</div>
          <div className="text-sm text-gray-400">{lead?.phone_number}</div>
        </div>
      </div>
    </div>
  );
};
