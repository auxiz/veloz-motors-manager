
import { Lead } from '../types';

type UseWhatsAppActionsProps = {
  originalConnectWhatsApp: () => Promise<boolean>;
  originalDisconnectWhatsApp: () => Promise<boolean>;
  sendMessageToLead: (phoneNumber: string, message: string, leadId: string, userId?: string) => Promise<boolean>;
  userId?: string;
};

export const useWhatsAppActions = ({
  originalConnectWhatsApp,
  originalDisconnectWhatsApp,
  sendMessageToLead,
  userId
}: UseWhatsAppActionsProps) => {
  // Wrap the connection function to adapt the return type
  const connectWhatsApp = async (): Promise<void> => {
    await originalConnectWhatsApp();
    // We don't return anything to match the Promise<void> return type
  };
  
  // Wrap the disconnection function to adapt the return type
  const disconnectWhatsApp = async (): Promise<void> => {
    await originalDisconnectWhatsApp();
    // We don't return anything to match the Promise<void> return type
  };

  // Updated to match the Promise<void> return type in WhatsAppContextType
  const sendMessage = async (phoneNumber: string, message: string, leadId: string): Promise<void> => {
    await sendMessageToLead(phoneNumber, message, leadId, userId);
    // We don't return anything to match the Promise<void> return type
  };

  return {
    connectWhatsApp,
    disconnectWhatsApp,
    sendMessage
  };
};
