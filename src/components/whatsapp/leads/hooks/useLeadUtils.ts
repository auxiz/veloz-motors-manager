
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';

export const useLeadUtils = () => {
  const { leads } = useWhatsAppContext();
  
  // Format a date string to be displayed in the UI
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Determine if a lead has unread messages
  const hasUnreadMessages = (leadId: string) => {
    return leads.some(lead => lead.id === leadId && lead.status === 'new');
  };

  // Get the appropriate color for a lead's status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-500';
      case 'contacted':
        return 'bg-yellow-500';
      case 'qualified':
        return 'bg-green-500';
      case 'unqualified':
        return 'bg-red-500';
      case 'converted':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return {
    formatDate,
    hasUnreadMessages,
    getStatusColor
  };
};
