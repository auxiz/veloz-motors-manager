
import React, { useState, useRef, useEffect } from 'react';
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

const MessagesPanel: React.FC = () => {
  const { selectedLead, messages, sendMessage, isLoading, markMessagesAsRead } = useWhatsAppContext();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Mark messages as read when component mounts or messages change
  useEffect(() => {
    if (selectedLead) {
      markMessagesAsRead(selectedLead.id);
    }
  }, [selectedLead, messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLead || !inputMessage.trim()) return;
    
    try {
      // Send the message and handle the void return type
      await sendMessage(
        selectedLead.phone_number,
        inputMessage.trim(),
        selectedLead.id
      );
      
      // Clear the input field after sending
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };
  
  const formatMessageDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups: any, message) => {
    const date = formatMessageDate(message.sent_at || message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  return (
    <Card className="bg-veloz-black border-veloz-gray h-full flex flex-col">
      <CardHeader className="pb-2 border-b border-veloz-gray">
        <CardTitle className="text-lg text-white flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={null} />
            <AvatarFallback className="bg-veloz-yellow text-black">
              {selectedLead?.name ? selectedLead.name.charAt(0).toUpperCase() : 'L'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div>{selectedLead?.name || 'Lead sem nome'}</div>
            <div className="text-sm text-gray-400">{selectedLead?.phone_number}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4" ref={messagesContainerRef}>
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="mb-4">
            <div className="text-center mb-2">
              <span className="text-xs bg-veloz-gray text-gray-300 px-2 py-1 rounded-full">
                {date}
              </span>
            </div>
            
            {groupedMessages[date].map((message: any) => (
              <div 
                key={message.id} 
                className={`mb-2 flex ${message.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.direction === 'outgoing' 
                      ? 'bg-veloz-yellow text-black' 
                      : 'bg-veloz-gray text-white'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap break-words">{message.message_text}</div>
                  <div className={`text-xs mt-1 text-right ${
                    message.direction === 'outgoing' ? 'text-black/70' : 'text-white/70'
                  }`}>
                    {formatMessageTime(message.sent_at)}
                    {message.direction === 'outgoing' && message.sent_by && (
                      <span className="ml-1">• {message.sent_by}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t border-veloz-gray p-4">
        <form className="w-full flex space-x-2" onSubmit={handleSubmit}>
          <Textarea
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="bg-veloz-gray text-white border-veloz-gray focus:ring-veloz-yellow focus:border-veloz-yellow"
            rows={1}
          />
          <Button 
            type="submit" 
            className="bg-veloz-yellow text-black hover:bg-yellow-500"
            disabled={isLoading || !selectedLead || !inputMessage.trim()}
          >
            <Send className={isLoading ? "animate-pulse" : ""} size={18} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default MessagesPanel;
