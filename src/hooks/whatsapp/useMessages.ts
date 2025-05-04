
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Message } from './types';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async (leadId: string) => {
    try {
      setLoading(true);
      // Use RPC function
      const { data, error } = await supabase
        .rpc('get_lead_messages', { p_lead_id: leadId });
        
      if (error) {
        throw error;
      }
      
      setMessages(data as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Falha ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (phoneNumber: string, message: string, leadId: string, userId: string | undefined): Promise<boolean> => {
    try {
      setLoading(true);
      
      console.log(`Sending message to ${phoneNumber}: ${message}`);
      
      const { data, error } = await supabase.functions.invoke('whatsapp-bot', {
        body: { 
          action: 'send_message', 
          phoneNumber,
          message,
          leadId
        },
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId || ''
        }
      });
      
      if (error) {
        console.error('Error sending message:', error);
        toast.error(`Falha ao enviar mensagem: ${error.message}`);
        return false;
      }
      
      if (!data.success) {
        console.error('Failed to send message:', data.message);
        toast.error(`Falha ao enviar mensagem: ${data.message}`);
        return false;
      }
      
      console.log('Message sent successfully');
      toast.success('Mensagem enviada com sucesso');
      
      // Fetch the messages again to update the UI
      await fetchMessages(leadId);
      
      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(`Falha ao enviar mensagem: ${error.message || error}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (leadId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('lead_id', leadId)
        .eq('direction', 'incoming')
        .eq('is_read', false);
        
      if (error) {
        console.error('Error marking messages as read:', error);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return {
    messages,
    loading,
    fetchMessages,
    sendMessage,
    markMessagesAsRead,
    setMessages
  };
};
