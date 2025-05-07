
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

// =========================================
// Configuration and Environment Setup
// =========================================
const config = {
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ],
    // Add support for configuring executablePath if needed
    // executablePath: Deno.env.get('CHROME_PATH') || undefined,
  },
  whatsapp: {
    reconnectInterval: 30000, // 30 seconds
    maxReconnectAttempts: 10,
    messageSendDelay: 1500, // 1.5 seconds between messages to prevent rate limiting
    qrCodeRefreshInterval: 25000, // 25 seconds (QR codes typically expire after 20-30 seconds)
  },
  database: {
    connectionTableName: 'whatsapp_connection',
    messagesTableName: 'messages',
    leadsTableName: 'leads',
    errorsTableName: 'whatsapp_errors',
  }
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// =========================================
// Types and Interfaces
// =========================================
interface WhatsAppClient {
  browser: any;
  page: any;
  isConnected: boolean;
  qrCode: string | null;
  lastActivity: number;
  reconnectAttempts: number;
  messageQueue: MessageQueueItem[];
  sessionData: Record<string, any> | null;
}

interface MessageQueueItem {
  phoneNumber: string;
  message: string;
  leadId?: string;
  timestamp: number;
  retries?: number;
  userId?: string;
}

interface ConnectionMetrics {
  lastActivity: number;
  reconnectAttempts: number;
  messageQueueSize: number;
  sessionState?: string;
}

type EventHandler = (data: any) => Promise<void>;

// =========================================
// Client State and Management
// =========================================
// Global WhatsApp client state
const whatsAppClient: WhatsAppClient = {
  browser: null,
  page: null,
  isConnected: false,
  qrCode: null,
  lastActivity: Date.now(),
  reconnectAttempts: 0,
  messageQueue: [],
  sessionData: null,
};

// Event handlers
const eventHandlers = {
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

// =========================================
// Session and Connection Management
// =========================================
async function initializeBrowser() {
  try {
    console.log("Initializing browser...");
    
    // Close existing browser if it exists
    if (whatsAppClient.browser) {
      try {
        await whatsAppClient.browser.close();
      } catch (error) {
        console.error("Error closing existing browser:", error);
      }
    }
    
    whatsAppClient.browser = await puppeteer.launch(config.puppeteer);
    
    whatsAppClient.page = await whatsAppClient.browser.newPage();
    await whatsAppClient.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    
    // Set default timeout
    await whatsAppClient.page.setDefaultTimeout(60000); // 60 seconds
    
    console.log("Browser initialized successfully");
    return { browser: whatsAppClient.browser, page: whatsAppClient.page };
  } catch (error) {
    console.error("Error initializing browser:", error);
    await logError("browser_init", `Failed to initialize browser: ${error.message}`);
    throw error;
  }
}

async function connectWhatsApp(): Promise<{ success: boolean; qrCode?: string; isConnected?: boolean; message?: string }> {
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

async function waitForAuthentication(): Promise<boolean> {
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

async function waitForQRCode(): Promise<void> {
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

async function extractQRCodeFromPage(): Promise<string | null> {
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

function setupQRRefreshTimer(): void {
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

function setupConnectionMonitoring(): void {
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

function setupMessageListeners(): void {
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

function scheduleReconnection(): void {
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
      await connectWhatsApp();
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

async function cleanupResources(): Promise<void> {
  if (whatsAppClient.browser) {
    try {
      await whatsAppClient.browser.close();
      console.log("Browser closed successfully");
    } catch (error) {
      console.error("Error closing browser:", error);
    } finally {
      whatsAppClient.browser = null;
      whatsAppClient.page = null;
    }
  }
}

async function resetSession(): Promise<void> {
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

async function disconnectWhatsApp(): Promise<{ success: boolean; message?: string }> {
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

async function refreshQRCode(): Promise<{ success: boolean; qrCode?: string; message?: string }> {
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

async function getConnectionStatus(): Promise<{
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

// =========================================
// Message Queue and Processing
// =========================================
async function sendMessage(
  phoneNumber: string,
  message: string,
  leadId: string = "",
  userId: string = ""
): Promise<{ success: boolean; message?: string }> {
  if (!whatsAppClient.isConnected || !whatsAppClient.page) {
    console.log("Not connected, adding message to queue");
    
    // Add to queue for later sending
    whatsAppClient.messageQueue.push({
      phoneNumber,
      message,
      leadId,
      userId,
      timestamp: Date.now(),
      retries: 0
    });
    
    return { success: false, message: "WhatsApp is not connected, message queued" };
  }
  
  try {
    // Add random delay to simulate human behavior (between 1-3 seconds)
    const randomDelay = Math.floor(Math.random() * 2000) + 1000;
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    
    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Check if number is registered with WhatsApp
    const isRegistered = await checkNumberRegistration(cleanPhone);
    if (!isRegistered) {
      console.log(`Phone number ${cleanPhone} is not registered with WhatsApp`);
      return { success: false, message: "Phone number not registered with WhatsApp" };
    }
    
    // Open chat with this contact
    await whatsAppClient.page.goto(`https://web.whatsapp.com/send?phone=${cleanPhone}`, { waitUntil: 'networkidle2' });
    
    // Wait for chat to load
    await whatsAppClient.page.waitForSelector('#main', { timeout: 10000 });
    
    // Type message with random delays between keystrokes to simulate human typing
    const messageInput = await whatsAppClient.page.waitForSelector('div[contenteditable="true"][data-testid="conversation-compose-box-input"]');
    
    // Type with random delays
    for (const char of message) {
      await messageInput.type(char, { delay: Math.floor(Math.random() * 100) + 30 });
      
      // Occasionally pause for longer (10% chance)
      if (Math.random() < 0.1) {
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 500) + 200));
      }
    }
    
    // Random delay before sending
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 500));
    
    // Press Enter to send
    await messageInput.press('Enter');
    
    console.log(`Message sent to ${phoneNumber}`);
    whatsAppClient.lastActivity = Date.now();
    
    // Store the sent message in the database if leadId is provided
    if (leadId) {
      await supabase.from(config.database.messagesTableName).insert({
        lead_id: leadId,
        message_text: message,
        direction: 'outgoing',
        sent_by: userId || null,
        is_read: true
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    await logError("send_message", error.message);
    
    // Add to retry queue
    whatsAppClient.messageQueue.push({
      phoneNumber,
      message,
      leadId,
      userId,
      timestamp: Date.now(),
      retries: 0
    });
    
    return { success: false, message: error.message };
  }
}

async function checkNumberRegistration(phoneNumber: string): Promise<boolean> {
  try {
    // This is a simplistic check - in a real implementation, use client.isRegisteredUser
    // For now, we'll just assume true
    return true;
  } catch (error) {
    console.error("Error checking number registration:", error);
    return true; // Default to true to attempt sending anyway
  }
}

async function processMessageQueue(): Promise<void> {
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
}

async function processIncomingMessage(phoneNumber: string, message: string): Promise<void> {
  try {
    // Clean phone number format
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Check if this is an existing lead
    const { data: existingLead } = await supabase
      .from(config.database.leadsTableName)
      .select('id, assigned_to')
      .eq('phone_number', cleanPhone)
      .maybeSingle();
    
    if (existingLead) {
      // Add message to existing lead
      await supabase.from(config.database.messagesTableName).insert({
        lead_id: existingLead.id,
        message_text: message,
        direction: 'incoming',
        is_read: false
      });
    } else {
      // Create new lead
      const { data: newLead } = await supabase
        .from(config.database.leadsTableName)
        .insert({
          phone_number: cleanPhone,
          first_message: message,
          status: 'novo'
        })
        .select()
        .single();
      
      if (newLead) {
        // Add first message
        await supabase.from(config.database.messagesTableName).insert({
          lead_id: newLead.id,
          message_text: message,
          direction: 'incoming',
          is_read: false
        });
        
        // Auto-assign to a salesperson
        await assignLeadToSalesperson(newLead.id);
      }
    }
  } catch (error) {
    console.error("Error processing incoming message:", error);
    await logError("message_processing", error.message);
  }
}

// =========================================
// Database Operations
// =========================================
async function storeConnectionData(data: Record<string, any>): Promise<void> {
  try {
    // Get the existing record id
    const { data: existingRecord, error: queryError } = await supabase
      .from(config.database.connectionTableName)
      .select('id')
      .limit(1)
      .single();
    
    if (queryError) {
      console.error("Error querying connection record:", queryError);
      return;
    }
    
    // Add timestamp
    data.updated_at = new Date().toISOString();
    
    if (existingRecord) {
      console.log("Updating existing connection record");
      await supabase
        .from(config.database.connectionTableName)
        .update(data)
        .eq('id', existingRecord.id);
    } else {
      // Create new record if none exists
      console.log("Creating new connection record");
      await supabase
        .from(config.database.connectionTableName)
        .insert({ ...data });
    }
  } catch (error) {
    console.error("Error updating WhatsApp connection data:", error);
  }
}

async function logError(errorType: string, errorMessage: string): Promise<void> {
  try {
    await supabase
      .from(config.database.errorsTableName)
      .insert({
        error_type: errorType,
        error_message: errorMessage,
        occurred_at: new Date().toISOString()
      });
  } catch (error) {
    console.error("Error logging to database:", error);
  }
}

async function assignLeadToSalesperson(leadId: string): Promise<void> {
  try {
    // Get all salespeople
    const { data: salespeople } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'seller');
    
    if (salespeople && salespeople.length > 0) {
      // Simple round-robin assignment
      const assignIndex = Math.floor(Math.random() * salespeople.length);
      const assignedTo = salespeople[assignIndex].id;
      
      // Update lead with assigned salesperson
      await supabase
        .from(config.database.leadsTableName)
        .update({ assigned_to: assignedTo })
        .eq('id', leadId);
      
      // Record the assignment
      await supabase
        .from('lead_assignments')
        .insert({
          lead_id: leadId,
          assigned_to: assignedTo,
          notes: 'Atribuído automaticamente pelo sistema'
        });
    }
  } catch (error) {
    console.error("Error assigning lead to salesperson:", error);
    await logError("lead_assignment", error.message);
  }
}

// =========================================
// API Router
// =========================================
// HTTP request handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Parse request data
    const url = new URL(req.url);
    let requestData = {};
    
    if (req.method === 'POST') {
      try {
        const contentType = req.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const bodyText = await req.text();
          if (bodyText && bodyText.trim()) {
            requestData = JSON.parse(bodyText);
          }
        }
      } catch (e) {
        console.error("Error parsing request JSON:", e);
        // Continue with empty request data if parse fails
      }
    }
    
    // Merge query params and body
    const data = { ...requestData, ...Object.fromEntries(url.searchParams) };
    const action = data.action || '';
    
    console.log("Edge function received action:", action, "with data:", JSON.stringify(data));
    
    // Route to appropriate handler based on action
    switch (action) {
      case 'connect':
        const connectResult = await connectWhatsApp();
        return new Response(JSON.stringify(connectResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      case 'disconnect':
        const disconnectResult = await disconnectWhatsApp();
        return new Response(JSON.stringify(disconnectResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      case 'reconnect':
        await cleanupResources();
        const reconnectResult = await connectWhatsApp();
        return new Response(JSON.stringify(reconnectResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      case 'status':
        const statusResult = await getConnectionStatus();
        return new Response(JSON.stringify(statusResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      case 'qrcode':
        const refreshResult = await refreshQRCode();
        return new Response(JSON.stringify(refreshResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      case 'send_message':
        const { phoneNumber, message, leadId, userId } = data as any;
        
        if (!phoneNumber || !message) {
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'Phone number and message are required' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          });
        }
        
        const sendResult = await sendMessage(phoneNumber, message, leadId, userId);
        return new Response(JSON.stringify(sendResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      default:
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Invalid action' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
    }
  } catch (error) {
    console.error("Error in edge function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message,
      stack: error.stack 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
