
import React, { useRef, useEffect } from 'react';
import { Message } from '@/hooks/whatsapp/useWhatsAppContext';
import { MessageDateGroup } from './MessageDateGroup';

interface MessageListProps {
  groupedMessages: Record<string, Message[]>;
  formatMessageTime: (timestamp: string) => string;
}

export const MessageList: React.FC<MessageListProps> = ({ groupedMessages, formatMessageTime }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [groupedMessages]);
  
  return (
    <div className="flex-grow overflow-y-auto p-4">
      {Object.keys(groupedMessages).map((date) => (
        <MessageDateGroup 
          key={date} 
          date={date} 
          messages={groupedMessages[date]} 
          formatMessageTime={formatMessageTime} 
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
