
// This file now re-exports from the refactored modules
import { useWhatsAppContext } from './context/useWhatsAppContext';
import { WhatsAppProvider } from './context/WhatsAppProvider';
import { Lead, Message } from './types';

export { 
  WhatsAppProvider, 
  useWhatsAppContext 
};

// Re-exporting types for easier access
export type { Lead, Message };
