
/**
 * Format a timestamp to display only the time (HH:MM)
 */
export const formatMessageTime = (timestamp: string): string => {
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

/**
 * Format a timestamp to display the date (DD/MM/YYYY)
 */
export const formatMessageDate = (timestamp: string): string => {
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

/**
 * Group messages by date
 */
export const groupMessagesByDate = (messages: any[]) => {
  return messages.reduce((groups: Record<string, any[]>, message) => {
    const date = formatMessageDate(message.sent_at || message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
};
