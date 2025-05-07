
import { whatsAppClient } from './client-state';
import { storeConnectionData, logError } from './database';
import { processIncomingMessage } from './message-processing';
import { resetSession, scheduleReconnection } from './connection-manager';

// Event handlers for WhatsApp events
export const eventHandlers = {
  onQRCodeGenerated: async (qrCodeData: string) => {
    console.log("QR Code generated, length:", qrCodeData.length);
    whatsAppClient.qrCode = qrCodeData;
    await storeConnectionData({
      is_connected: false,
      qr_code: qrCodeData,
    });
  },
  
  onConnected: async () => {
    console.log("WhatsApp Web connected successfully!");
    whatsAppClient.isConnected = true;
    whatsAppClient.qrCode = null;
    whatsAppClient.reconnectAttempts = 0;
    whatsAppClient.lastActivity = Date.now();
    
    await storeConnectionData({
      is_connected: true,
      last_connected_at: new Date().toISOString(),
      qr_code: null,
    });
    
    // Process any messages in the queue
    await processMessageQueue();
  },
  
  onDisconnected: async (reason: string = "unknown") => {
    console.log(`WhatsApp Web disconnected, reason: ${reason}`);
    whatsAppClient.isConnected = false;
    
    await storeConnectionData({
      is_connected: false,
      last_disconnected_at: new Date().toISOString(),
      disconnect_reason: reason,
    });
    
    // Attempt to reconnect if appropriate
    if (
      whatsAppClient.reconnectAttempts < config.whatsapp.maxReconnectAttempts &&
      reason !== "LOGOUT" && 
      reason !== "CONFLICT"
    ) {
      scheduleReconnection();
    } else {
      console.log(`Not attempting reconnection due to reason: ${reason} or max attempts reached`);
      await logError("max_reconnect_attempts", `Maximum reconnection attempts (${config.whatsapp.maxReconnectAttempts}) reached`);
    }
  },
  
  onConnectionStateChange: async (state: string) => {
    console.log(`WhatsApp connection state changed: ${state}`);
    
    await storeConnectionData({
      connection_state: state,
      updated_at: new Date().toISOString(),
    });
    
    // Handle specific state changes
    switch(state) {
      case "CONFLICT":
        console.log("WhatsApp session conflict detected - device may be logged in elsewhere");
        await logError("session_conflict", "WhatsApp session conflict detected");
        break;
      
      case "UNPAIRED":
      case "UNLAUNCHED":
        console.log(`WhatsApp session is in ${state} state - attempting reconnection`);
        whatsAppClient.isConnected = false;
        scheduleReconnection();
        break;
    }
  },
  
  onError: async (error: Error) => {
    console.error("WhatsApp client error:", error);
    await logError("client_error", error.message);
  },
  
  onMessageReceived: async (phoneNumber: string, message: string) => {
    console.log(`New message from ${phoneNumber}: ${message}`);
    whatsAppClient.lastActivity = Date.now();
    
    try {
      await processIncomingMessage(phoneNumber, message);
    } catch (error) {
      console.error("Error processing incoming message:", error);
      await logError("message_processing", error.message);
    }
  },
  
  onAuthFailure: async (error: Error) => {
    console.error("WhatsApp authentication failure:", error);
    whatsAppClient.isConnected = false;
    await logError("auth_failure", error.message);
    
    // Reset the session on auth failure
    await resetSession();
  }
};

import { config } from './config';

export const processMessageQueue = async (): Promise<void> => {
  // This imported cyclically so importing it here inside the function
  // to avoid circular dependency issues
  const { sendMessage } = await import('./message-processing');
  
  if (!whatsAppClient.isConnected || whatsAppClient.messageQueue.length === 0) {
    return;
  }
  
  console.log(`Processing message queue: ${whatsAppClient.messageQueue.length} messages`);
  
  // Process messages one by one with delay
  while (whatsAppClient.messageQueue.length > 0) {
    // Stop processing if we're disconnected
    if (!whatsAppClient.isConnected) {
      console.log("Disconnected while processing queue, stopping");
      break;
    }
    
    const item = whatsAppClient.messageQueue.shift();
    if (!item) continue;
    
    try {
      console.log(`Sending queued message to ${item.phoneNumber}`);
      await sendMessage(item.phoneNumber, item.message, item.leadId, item.userId);
      
      // Add delay between messages to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, config.whatsapp.messageSendDelay));
    } catch (error) {
      console.error(`Error sending queued message to ${item.phoneNumber}:`, error);
      
      // Retry logic - add back to queue if under retry limit
      if ((item.retries || 0) < 3) {
        console.log(`Scheduling retry for message to ${item.phoneNumber}`);
        whatsAppClient.messageQueue.push({
          ...item,
          retries: (item.retries || 0) + 1,
          timestamp: Date.now()
        });
      } else {
        console.error(`Max retries reached for message to ${item.phoneNumber}, dropping`);
      }
    }
  }
};
