
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
  // Wrap the connection function to explicitly adapt the return type to void
  const connectWhatsApp = async (): Promise<void> => {
    await originalConnectWhatsApp();
    // Not returning anything to match the Promise<void> return type
    return;
  };
  
  // Wrap the disconnection function to explicitly adapt the return type to void
  const disconnectWhatsApp = async (): Promise<void> => {
    await originalDisconnectWhatsApp();
    // Not returning anything to match the Promise<void> return type
    return;
  };

  // Updated to match the Promise<void> return type in WhatsAppContextType
  const sendMessage = async (phoneNumber: string, message: string, leadId: string): Promise<void> => {
    await sendMessageToLead(phoneNumber, message, leadId, userId);
    // Not returning anything to match the Promise<void> return type
    return;
  };

  return {
    connectWhatsApp,
    disconnectWhatsApp,
    sendMessage
  };
};
