
import React, { useEffect } from 'react';
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MessageHeader } from './messages/MessageHeader';
import { MessageList } from './messages/MessageList';
import { MessageInput } from './messages/MessageInput';
import { groupMessagesByDate, formatMessageTime } from './messages/utils/messageFormatters';

const MessagesPanel: React.FC = () => {
  const { selectedLead, messages, sendMessage, markMessagesAsRead } = useWhatsAppContext();
  
  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);
  
  // Mark messages as read when component mounts or messages change
  useEffect(() => {
    if (selectedLead) {
      markMessagesAsRead(selectedLead.id);
    }
  }, [selectedLead, messages, markMessagesAsRead]);
  
  const handleSendMessage = async (message: string): Promise<void> => {
    if (!selectedLead) return;
    
    await sendMessage(
      selectedLead.phone_number,
      message,
      selectedLead.id
    );
  };
  
  return (
    <Card className="bg-veloz-black border-veloz-gray h-full flex flex-col">
      <CardHeader className="pb-2 border-b border-veloz-gray">
        <MessageHeader lead={selectedLead} />
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-0">
        <MessageList 
          groupedMessages={groupedMessages} 
          formatMessageTime={formatMessageTime} 
        />
      </CardContent>
      <CardFooter className="border-t border-veloz-gray p-4">
        <MessageInput 
          onSendMessage={handleSendMessage}
          disabled={!selectedLead}
        />
      </CardFooter>
    </Card>
  );
};

export default MessagesPanel;
