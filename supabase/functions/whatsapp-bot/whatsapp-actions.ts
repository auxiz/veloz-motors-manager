
import { whatsAppClient } from './client-state';
import { initializeBrowser, cleanupResources } from './browser-manager';
import { eventHandlers } from './event-handlers';
import { waitForAuthentication, waitForQRCode, setupMessageListeners, setupQRRefreshTimer, setupConnectionMonitoring } from './connection-manager';
import { logError } from './database';
import { sendMessage } from './message-processing';
import { ActionHandlers } from './types';

export async function connectWhatsApp(): Promise<{ success: boolean; qrCode?: string; isConnected?: boolean; message?: string }> {
  if (whatsAppClient.isConnected) {
    console.log("Already connected to WhatsApp Web");
    return { success: true, isConnected: true };
  }
  
  try {
    // Initialize browser if needed
    if (!whatsAppClient.browser || !whatsAppClient.page) {
      await initializeBrowser();
    }
    
    console.log("Navigating to WhatsApp Web...");
    await whatsAppClient.page.goto('https://web.whatsapp.com/', { 
      waitUntil: 'networkidle2',
      timeout: 60000 // 60 seconds timeout for initial load
    });
    
    // Wait for either QR code to appear or session restore
    try {
      console.log("Checking for session or QR code...");
      
      // Try to detect if we're already logged in (look for chat list)
      const isLoggedIn = await waitForAuthentication();
      
      if (isLoggedIn) {
        // Already authenticated, no need for QR code
        await eventHandlers.onConnected();
        return { success: true, isConnected: true };
      }
      
      // Not logged in, wait for QR code
      console.log("Not logged in, waiting for QR code...");
      await waitForQRCode();
      
    } catch (error) {
      console.error("Error during authentication check:", error);
      await logError("authentication_check", error.message);
      return { success: false, message: `Authentication check failed: ${error.message}` };
    }
    
    // Set up message listeners
    setupMessageListeners();
    
    // Set up automatic QR refresh timer
    setupQRRefreshTimer();
    
    // Set up connection status monitoring
    setupConnectionMonitoring();
    
    return { 
      success: true, 
      qrCode: whatsAppClient.qrCode,
      isConnected: false
    };
  } catch (error) {
    console.error("Error connecting to WhatsApp:", error);
    await logError("connection", error.message);
    await cleanupResources();
    return { success: false, message: error.message };
  }
}

export async function disconnectWhatsApp(): Promise<{ success: boolean; message?: string }> {
  try {
    await cleanupResources();
    await eventHandlers.onDisconnected("USER_LOGOUT");
    
    return { success: true };
  } catch (error) {
    console.error("Error disconnecting from WhatsApp:", error);
    await logError("disconnection", error.message);
    return { success: false, message: error.message };
  }
}

export async function refreshQRCode(): Promise<{ success: boolean; qrCode?: string; message?: string }> {
  try {
    // Only refresh if we're not connected
    if (whatsAppClient.isConnected) {
      return { 
        success: false, 
        message: "Cannot refresh QR code while connected"
      };
    }
    
    // If we have a page, reload it to get a new QR code
    if (whatsAppClient.page) {
      console.log("Reloading page to refresh QR code");
      await whatsAppClient.page.reload({ waitUntil: 'networkidle2' });
      await waitForQRCode();
      
      return { 
        success: true, 
        qrCode: whatsAppClient.qrCode
      };
    } else {
      // Need to reinitialize
      console.log("Reinitializing to get new QR code");
      const result = await connectWhatsApp();
      return {
        success: result.success,
        qrCode: result.qrCode,
        message: result.message
      };
    }
  } catch (error) {
    console.error("Error refreshing QR code:", error);
    return { success: false, message: error.message };
  }
}

export async function getConnectionStatus(): Promise<{
  isConnected: boolean;
  qrCode: string | null;
  lastActivity: number;
  reconnectAttempts: number;
  messageQueueSize: number;
}> {
  return {
    isConnected: whatsAppClient.isConnected,
    qrCode: whatsAppClient.qrCode,
    lastActivity: whatsAppClient.lastActivity,
    reconnectAttempts: whatsAppClient.reconnectAttempts,
    messageQueueSize: whatsAppClient.messageQueue.length,
  };
}

export async function reconnectWhatsApp(): Promise<{ success: boolean; qrCode?: string; isConnected?: boolean; message?: string }> {
  try {
    await cleanupResources();
    return await connectWhatsApp();
  } catch (error) {
    console.error("Error during reconnection:", error);
    await logError("reconnection", error.message);
    return { success: false, message: error.message };
  }
}

// Action handlers for the API
export const actionHandlers: ActionHandlers = {
  connect: connectWhatsApp,
  disconnect: disconnectWhatsApp,
  reconnect: reconnectWhatsApp,
  status: getConnectionStatus,
  qrcode: refreshQRCode,
  send_message: async (data: any) => {
    const { phoneNumber, message, leadId, userId } = data;
    
    if (!phoneNumber || !message) {
      return {
        success: false,
        message: 'Phone number and message are required'
      };
    }
    
    return await sendMessage(phoneNumber, message, leadId, userId);
  }
};
