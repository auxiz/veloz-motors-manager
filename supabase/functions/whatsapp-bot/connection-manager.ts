
import { whatsAppClient } from './client-state';
import { config } from './config';
import { storeConnectionData, logError } from './database';
import { initializeBrowser, cleanupResources } from './browser-manager';
import { eventHandlers } from './event-handlers';

export async function waitForQRCode(): Promise<void> {
  try {
    // Wait for QR code to appear
    console.log("Waiting for QR code to appear...");
    await whatsAppClient.page.waitForSelector('canvas[aria-label="Scan me!"]', { timeout: 20000 });
    
    // Extract QR code
    console.log("Extracting QR code data...");
    const qrCodeData = await extractQRCodeFromPage();
    
    if (qrCodeData) {
      await eventHandlers.onQRCodeGenerated(qrCodeData);
    } else {
      throw new Error("Failed to extract QR code");
    }
  } catch (error) {
    console.error("Error waiting for QR code:", error);
    throw error;
  }
}

export async function extractQRCodeFromPage(): Promise<string | null> {
  return await whatsAppClient.page.evaluate(() => {
    const canvas = document.querySelector('canvas[aria-label="Scan me!"]');
    if (!canvas) {
      console.error("Canvas for QR code not found");
      return null;
    }
    try {
      return canvas.toDataURL() || null;
    } catch (e) {
      console.error("Error converting canvas to data URL:", e);
      return null;
    }
  });
}

export function setupQRRefreshTimer(): void {
  // Set up a timer to refresh the QR code periodically
  setTimeout(async () => {
    if (!whatsAppClient.isConnected) {
      console.log("QR Code may be expired, refreshing...");
      try {
        // Check if we're still on the correct page and QR code is showing
        const isOnWhatsAppWeb = await whatsAppClient.page.evaluate(() => {
          return window.location.hostname === 'web.whatsapp.com' &&
                 document.querySelector('canvas[aria-label="Scan me!"]') !== null;
        });
        
        if (isOnWhatsAppWeb) {
          // Refresh page to get a new QR code
          await whatsAppClient.page.reload({ waitUntil: 'networkidle2' });
          await waitForQRCode();
        }
      } catch (error) {
        console.error("Error refreshing QR code:", error);
      }
    }
  }, config.whatsapp.qrCodeRefreshInterval);
}

export function setupConnectionMonitoring(): void {
  // Set up periodic connection status check
  setInterval(async () => {
    try {
      // Check if page is still on WhatsApp Web
      const currentUrl = await whatsAppClient.page.url();
      if (!currentUrl.includes('web.whatsapp.com')) {
        console.log("No longer on WhatsApp Web page, attempting to reconnect...");
        await eventHandlers.onDisconnected("PAGE_CHANGED");
        return;
      }
      
      // Check for active session
      const isSessionActive = await whatsAppClient.page.evaluate(() => {
        return document.querySelector('div[data-testid="chat-list"]') !== null;
      });
      
      if (!isSessionActive && whatsAppClient.isConnected) {
        console.log("Session appears to be expired");
        await eventHandlers.onDisconnected("SESSION_EXPIRED");
      } else if (isSessionActive && !whatsAppClient.isConnected) {
        console.log("Session appears to be active but client status is disconnected");
        await eventHandlers.onConnected();
      }
    } catch (error) {
      console.error("Error monitoring connection:", error);
    }
  }, 30000); // Check every 30 seconds
}

export function setupMessageListeners(): void {
  if (!whatsAppClient.page) return;
  
  try {
    console.log("Setting up message listeners...");
    
    // Using a specific try/catch inside the function to avoid crashing the edge function
    whatsAppClient.page.exposeFunction('onNewMessage', async (phoneNumber: string, message: string) => {
      try {
        await eventHandlers.onMessageReceived(phoneNumber, message);
      } catch (error) {
        console.error("Error in message handler:", error);
      }
    }).catch(err => console.error("Error exposing function:", err));
    
    // Inject listener for new messages
    whatsAppClient.page.evaluate(() => {
      try {
        const observer = new MutationObserver(mutations => {
          for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
              // Find new incoming messages
              const newMessages = document.querySelectorAll('.message-in:not([data-processed])');
              
              newMessages.forEach(msg => {
                const msgElement = msg as HTMLElement;
                msgElement.setAttribute('data-processed', 'true');
                
                const phoneElement = msgElement.closest('[data-testid="conversation-panel"]');
                let phoneNumber = "unknown";
                
                if (phoneElement) {
                  // Extract phone number from conversation panel
                  const headerElement = phoneElement.querySelector('[data-testid="conversation-header"]');
                  if (headerElement) {
                    phoneNumber = headerElement.textContent || "unknown";
                  }
                }
                
                const messageText = msgElement.textContent || "";
                if (messageText) {
                  // @ts-ignore
                  window.onNewMessage(phoneNumber, messageText).catch(err => console.error("Error calling onNewMessage:", err));
                }
              });
            }
          }
        });
        
        // Start observing the chat container
        const chatContainer = document.querySelector('#main');
        if (chatContainer) {
          observer.observe(chatContainer, { childList: true, subtree: true });
        } else {
          console.warn("Chat container not found for message observation");
        }
      } catch (error) {
        console.error("Error setting up message observer:", error);
      }
    }).catch(err => console.error("Error injecting message listener:", err));
    
  } catch (error) {
    console.error("Error setting up message listeners:", error);
  }
}

export function scheduleReconnection(): void {
  whatsAppClient.reconnectAttempts++;
  
  console.log(`Scheduling reconnection attempt ${whatsAppClient.reconnectAttempts}/${config.whatsapp.maxReconnectAttempts} in ${config.whatsapp.reconnectInterval/1000}s`);
  
  // Use exponential backoff for reconnection attempts
  const delay = Math.min(
    config.whatsapp.reconnectInterval * Math.pow(1.5, whatsAppClient.reconnectAttempts - 1), 
    300000 // Cap at 5 minutes
  );
  
  setTimeout(async () => {
    console.log(`Executing reconnection attempt ${whatsAppClient.reconnectAttempts}`);
    try {
      await cleanupResources();
      const connectModule = await import('./whatsapp-actions');
      await connectModule.connectWhatsApp();
    } catch (error) {
      console.error("Error during reconnection:", error);
      await logError("reconnection", error.message);
      
      // Schedule another attempt if we haven't reached the limit
      if (whatsAppClient.reconnectAttempts < config.whatsapp.maxReconnectAttempts) {
        scheduleReconnection();
      } else {
        console.log("Maximum reconnection attempts reached");
        await logError("max_reconnect_attempts", "Maximum reconnection attempts reached");
      }
    }
  }, delay);
}

export async function resetSession(): Promise<void> {
  await cleanupResources();
  whatsAppClient.isConnected = false;
  whatsAppClient.qrCode = null;
  whatsAppClient.reconnectAttempts = 0;
  whatsAppClient.sessionData = null;
  
  await storeConnectionData({
    is_connected: false,
    qr_code: null,
    session_data: null,
    updated_at: new Date().toISOString(),
  });
}

export async function waitForAuthentication(): Promise<boolean> {
  try {
    // Wait for chat list with short timeout
    await whatsAppClient.page.waitForSelector('div[data-testid="chat-list"]', { timeout: 5000 });
    console.log("Found chat list - user is already authenticated");
    return true;
  } catch (error) {
    // Timeout or selector not found means we're not logged in yet
    console.log("Chat list not found - user is not authenticated");
    return false;
  }
}
