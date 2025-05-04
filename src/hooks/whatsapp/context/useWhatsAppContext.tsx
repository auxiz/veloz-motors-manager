
import { useContext } from 'react';
import { WhatsAppContext } from './WhatsAppProvider';
import { Lead, Message } from '../types';

export const useWhatsAppContext = () => {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error('useWhatsAppContext must be used within a WhatsAppProvider');
  }
  return context;
};

// Re-exporting types for easier access
export type { Lead, Message } from '../types';
