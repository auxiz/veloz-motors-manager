
import React from 'react';
import { Message } from '@/hooks/whatsapp/useWhatsAppContext';
import { MessageBubble } from './MessageBubble';

interface MessageDateGroupProps {
  date: string;
  messages: Message[];
  formatMessageTime: (timestamp: string) => string;
}

export const MessageDateGroup: React.FC<MessageDateGroupProps> = ({ date, messages, formatMessageTime }) => {
  return (
    <div key={date} className="mb-4">
      <div className="text-center mb-2">
        <span className="text-xs bg-veloz-gray text-gray-300 px-2 py-1 rounded-full">
          {date}
        </span>
      </div>
      
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          formatMessageTime={formatMessageTime} 
        />
      ))}
    </div>
  );
};
