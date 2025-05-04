
import React from 'react';
import { Message } from '@/hooks/whatsapp/useWhatsAppContext';

interface MessageBubbleProps {
  message: Message;
  formatMessageTime: (timestamp: string) => string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, formatMessageTime }) => {
  const isOutgoing = message.direction === 'outgoing';
  
  return (
    <div 
      className={`mb-2 flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isOutgoing 
            ? 'bg-veloz-yellow text-black' 
            : 'bg-veloz-gray text-white'
        }`}
      >
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.message_text}
        </div>
        <div className={`text-xs mt-1 text-right ${
          isOutgoing ? 'text-black/70' : 'text-white/70'
        }`}>
          {formatMessageTime(message.sent_at)}
          {isOutgoing && message.sent_by && (
            <span className="ml-1">• {message.sent_by}</span>
          )}
        </div>
      </div>
    </div>
  );
};
