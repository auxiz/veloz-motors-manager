import React, { useState, useRef, useEffect } from 'react';
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User, Phone, Tag, Calendar, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { useUsers } from '@/hooks/useUsers';

const MessagesPanel: React.FC = () => {
  const { selectedLead, messages, sendMessage, updateLead, loading } = useWhatsAppContext();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUsers();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedLead) return;
    
    setSending(true);
    const success = await sendMessage(
      selectedLead.phone_number,
      newMessage,
      selectedLead.id
    );
    
    if (success) {
      setNewMessage('');
      
      // If this is the first outgoing message to a 'new' lead, update status to 'contacted'
      if (selectedLead.status === 'new') {
        await updateLead(selectedLead.id, { status: 'contacted' });
      }
    }
    
    setSending(false);
  };
  
  const handleStatusChange = async (status: string) => {
    if (!selectedLead) return;
    
    try {
      await updateLead(selectedLead.id, { status });
      toast.success(`Lead status updated to ${status}`);
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const formatPhone = (phone: string) => {
    if (!phone) return '';
    
    // Try to format as Brazilian phone: (XX) XXXXX-XXXX
    const digits = phone.replace(/\D/g, '');
    const match = digits.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phone;
  };
  
  const formatSourceName = (source: string | null) => {
    if (!source) return 'WhatsApp';
    return source.charAt(0).toUpperCase() + source.slice(1);
  };
  
  if (!selectedLead) return null;
  
  return (
    <Card className="h-full flex flex-col bg-veloz-gray border-veloz-gray text-white">
      <CardHeader className="border-b border-veloz-black">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-veloz-yellow text-black h-10 w-10 rounded-full flex items-center justify-center">
              <User />
            </div>
            
            <div>
              <div className="font-medium">
                {selectedLead.name || 'Unknown Contact'}
              </div>
              <div className="text-sm text-gray-400 flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {formatPhone(selectedLead.phone_number)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={selectedLead.status} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[130px] bg-veloz-black border-veloz-black">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-veloz-black text-white">
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="test_drive">Test Drive</SelectItem>
                <SelectItem value="negotiating">Negotiating</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-veloz-black text-white">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Lead Info</h4>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Created: </span>
                        <span className="text-sm">
                          {new Date(selectedLead.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Source: </span>
                        <span className="text-sm">
                          {selectedLead.lead_source || 'WhatsApp'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4">
        <div className="flex flex-col space-y-4">
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No messages yet
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.direction === 'outgoing' 
                      ? 'bg-veloz-yellow text-black rounded-br-none' 
                      : 'bg-veloz-black text-white rounded-bl-none'
                  }`}
                >
                  <div className="text-sm">{message.message_text}</div>
                  <div className="text-xs text-right mt-1 opacity-70">
                    {formatTime(message.sent_at)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-veloz-black p-3">
        <form 
          className="flex w-full items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            className="flex-grow bg-veloz-black border-veloz-black text-white"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending || !user}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-veloz-yellow text-black hover:bg-yellow-500"
            disabled={sending || !newMessage.trim() || !user}
          >
            {sending ? (
              <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default MessagesPanel;
