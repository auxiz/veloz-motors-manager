
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [inputMessage, setInputMessage] = useState('');
  const { isLoading } = useWhatsAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    try {
      await onSendMessage(inputMessage.trim());
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
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
        disabled={isLoading || disabled || !inputMessage.trim()}
      >
        <Send className={isLoading ? "animate-pulse" : ""} size={18} />
      </Button>
    </form>
  );
};
