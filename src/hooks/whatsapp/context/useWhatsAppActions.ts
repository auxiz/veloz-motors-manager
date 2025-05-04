
import { ConnectionStatus } from '../types';

type UseWhatsAppActionsProps = {
  originalConnectWhatsApp: () => Promise<boolean>;
  originalDisconnectWhatsApp: () => Promise<boolean>;
  sendMessageToLead: (phoneNumber: string, message: string, leadId: string, userId?: string) => Promise<void>;
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
  };
  
  // Wrap the disconnection function to adapt the return type
  const disconnectWhatsApp = async (): Promise<void> => {
    await originalDisconnectWhatsApp();
  };

  // Updated to match the Promise<void> return type in WhatsAppContextType
  const sendMessage = async (phoneNumber: string, message: string, leadId: string): Promise<void> => {
    await sendMessageToLead(phoneNumber, message, leadId, userId);
    // We're not returning anything here to match the Promise<void> return type
  };

  return {
    connectWhatsApp,
    disconnectWhatsApp,
    sendMessage
  };
};
