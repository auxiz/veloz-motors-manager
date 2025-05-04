
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts"

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const supabase = createClient(supabaseUrl, supabaseKey)

// Global variables for WhatsApp client state
let browser: any = null
let page: any = null
let isConnected = false
let qrCode: string | null = null
let lastActivity = Date.now()
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_INTERVAL = 30000 // 30 seconds

// Store incoming messages queue
const messageQueue: any[] = []

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Event handlers
const eventHandlers = {
  onQRCodeGenerated: async (qrCodeData: string) => {
    console.log("QR Code generated, length:", qrCodeData.length)
    qrCode = qrCodeData
    await updateWhatsAppConnection(false, qrCode)
  },
  
  onConnected: async () => {
    console.log("WhatsApp Web connected successfully!")
    isConnected = true
    qrCode = null
    reconnectAttempts = 0
    await updateWhatsAppConnection(true)
  },
  
  onDisconnected: async () => {
    console.log("WhatsApp Web disconnected")
    isConnected = false
    await updateWhatsAppConnection(false)
  },
  
  onMessageReceived: async (phoneNumber: string, message: string) => {
    console.log(`New message from ${phoneNumber}: ${message}`)
    messageQueue.push({ phoneNumber, message, timestamp: Date.now() })
    await processIncomingMessage(phoneNumber, message)
  },
  
  onError: async (error: Error) => {
    console.error("WhatsApp client error:", error)
    await logErrorToDatabase("client_error", error.message)
  }
}

// Connection manager
const connectionManager = {
  async initBrowser() {
    try {
      console.log("Initializing browser...")
      
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ],
      })
      
      page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
      
      return { browser, page }
    } catch (error) {
      console.error("Error initializing browser:", error)
      await logErrorToDatabase("browser_init", error.message)
      throw error
    }
  },
  
  async connect() {
    if (isConnected) {
      console.log("Already connected to WhatsApp Web")
      return { success: true, isConnected, qrCode }
    }
    
    try {
      if (!browser || !page) {
        const result = await this.initBrowser()
        browser = result.browser
        page = result.page
      }
      
      console.log("Navigating to WhatsApp Web...")
      await page.goto('https://web.whatsapp.com/', { waitUntil: 'networkidle2' })
      
      // Wait for QR code to appear
      console.log("Waiting for QR code to appear...")
      await page.waitForSelector('canvas[aria-label="Scan me!"]', { timeout: 20000 })
      
      // Get QR code data
      console.log("Extracting QR code data...")
      qrCode = await page.evaluate(() => {
        const canvas = document.querySelector('canvas[aria-label="Scan me!"]')
        if (!canvas) {
          console.error("Canvas for QR code not found")
          return null
        }
        try {
          return canvas.toDataURL() || null
        } catch (e) {
          console.error("Error converting canvas to data URL:", e)
          return null
        }
      })
      
      if (qrCode) {
        await eventHandlers.onQRCodeGenerated(qrCode)
      } else {
        console.error("Failed to generate QR code")
        await logErrorToDatabase("qr_generation", "Failed to generate QR code")
        return { success: false, message: "Failed to generate QR code" }
      }
      
      // Set up a promise that resolves when WhatsApp is ready (chat list is loaded)
      // or rejects after a timeout
      const connectionPromise = Promise.race([
        page.waitForSelector('div[data-testid="chat-list"]', { timeout: 60000 })
          .then(() => {
            return eventHandlers.onConnected()
          }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 60000))
      ])
      
      // Start listening for incoming messages in the background
      this.setupMessageListeners()
      
      // Return the QR code immediately so the user can scan it
      return { success: true, qrCode, isConnected: false }
      
    } catch (error) {
      console.error("Error connecting to WhatsApp:", error)
      await logErrorToDatabase("connection", error.message)
      await this.cleanup()
      return { success: false, message: error.message }
    }
  },
  
  async setupMessageListeners() {
    if (!page) return false
    
    try {
      console.log("Setting up message listeners...")
      
      // Expose function to Puppeteer page context
      await page.exposeFunction('onNewMessage', async (phoneNumber: string, message: string) => {
        await eventHandlers.onMessageReceived(phoneNumber, message)
      })
      
      // Inject listener for new messages
      await page.evaluate(() => {
        const observer = new MutationObserver(mutations => {
          for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
              // Find new incoming messages
              const newMessages = document.querySelectorAll('.message-in:not([data-processed])')
              
              newMessages.forEach(msg => {
                const msgElement = msg as HTMLElement
                msgElement.setAttribute('data-processed', 'true')
                
                const phoneElement = msgElement.closest('[data-testid="conversation-panel"]')
                let phoneNumber = "unknown"
                
                if (phoneElement) {
                  // Extract phone number from conversation panel
                  const headerElement = phoneElement.querySelector('[data-testid="conversation-header"]')
                  if (headerElement) {
                    phoneNumber = headerElement.textContent || "unknown"
                  }
                }
                
                const messageText = msgElement.textContent || ""
                if (messageText) {
                  // @ts-ignore
                  window.onNewMessage(phoneNumber, messageText)
                }
              })
            }
          }
        })
        
        // Start observing the chat container
        const chatContainer = document.querySelector('#main')
        if (chatContainer) {
          observer.observe(chatContainer, { childList: true, subtree: true })
        }
      })
      
      // Setup connection status monitoring
      setInterval(async () => {
        // Check if we're still on WhatsApp Web
        const currentUrl = await page.url()
        if (!currentUrl.includes('web.whatsapp.com')) {
          console.log("No longer on WhatsApp Web page, attempting to reconnect...")
          await eventHandlers.onDisconnected()
          await this.reconnect()
        }
        
        // Check for session expiration
        const isSessionExpired = await page.evaluate(() => {
          return document.querySelector('div[data-testid="chat-list"]') === null
        })
        
        if (isSessionExpired && isConnected) {
          console.log("Session appears to be expired, updating status...")
          await eventHandlers.onDisconnected()
        }
      }, 30000) // Check every 30 seconds
      
      return true
    } catch (error) {
      console.error("Error setting up message listeners:", error)
      await logErrorToDatabase("message_listeners", error.message)
      return false
    }
  },
  
  async disconnect() {
    try {
      await this.cleanup()
      await eventHandlers.onDisconnected()
      return { success: true }
    } catch (error) {
      console.error("Error disconnecting from WhatsApp:", error)
      await logErrorToDatabase("disconnection", error.message)
      return { success: false, message: error.message }
    }
  },
  
  async reconnect() {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log(`Maximum reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached, giving up`)
      await logErrorToDatabase("reconnect_limit", "Maximum reconnection attempts reached")
      return { success: false, message: "Maximum reconnection attempts reached" }
    }
    
    reconnectAttempts++
    console.log(`Attempting to reconnect (attempt ${reconnectAttempts})`)
    
    try {
      await this.cleanup()
      await this.connect()
      return { success: true }
    } catch (error) {
      console.error("Error during reconnection:", error)
      await logErrorToDatabase("reconnection", error.message)
      
      // Schedule another attempt
      setTimeout(() => this.reconnect(), RECONNECT_INTERVAL)
      return { success: false, message: error.message }
    }
  },
  
  async cleanup() {
    if (browser) {
      try {
        await browser.close()
        console.log("Browser closed successfully")
      } catch (error) {
        console.error("Error closing browser:", error)
      } finally {
        browser = null
        page = null
        isConnected = false
        qrCode = null
      }
    }
  },
  
  async getStatus() {
    return { 
      isConnected, 
      qrCode: qrCode || null, 
      lastActivity, 
      reconnectAttempts, 
      messageQueueSize: messageQueue.length
    }
  }
}

// Client Factory (creates and manages single WhatsApp client instance)
const clientFactory = {
  isInitialized: false,
  
  async initialize() {
    if (this.isInitialized) {
      return { success: true, message: "Already initialized" }
    }
    
    try {
      await connectionManager.initBrowser()
      this.isInitialized = true
      return { success: true }
    } catch (error) {
      console.error("Error initializing client:", error)
      return { success: false, message: error.message }
    }
  }
}

// WhatsApp client API
const client = {
  async connect() {
    return await connectionManager.connect()
  },
  
  async disconnect() {
    return await connectionManager.disconnect()
  },
  
  async reconnect() {
    return await connectionManager.reconnect()
  },
  
  async getStatus() {
    return await connectionManager.getStatus()
  },
  
  async sendMessage(phoneNumber: string, message: string, leadId: string = "") {
    if (!isConnected || !page) {
      return { success: false, message: "WhatsApp is not connected" }
    }
    
    try {
      // Add random delay to simulate human behavior (between 1-3 seconds)
      const randomDelay = Math.floor(Math.random() * 2000) + 1000
      await new Promise(resolve => setTimeout(resolve, randomDelay))
      
      // Clean phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '')
      
      // Open chat with this contact
      await page.goto(`https://web.whatsapp.com/send?phone=${cleanPhone}`, { waitUntil: 'networkidle2' })
      
      // Wait for chat to load
      await page.waitForSelector('#main', { timeout: 10000 })
      
      // Type message with random delays between keystrokes to simulate human typing
      const messageInput = await page.waitForSelector('div[contenteditable="true"][data-testid="conversation-compose-box-input"]')
      
      // Type with random delays
      for (const char of message) {
        await messageInput.type(char, { delay: Math.floor(Math.random() * 100) + 30 })
        
        // Occasionally pause for longer (10% chance)
        if (Math.random() < 0.1) {
          await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 500) + 200))
        }
      }
      
      // Random delay before sending
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 500))
      
      // Press Enter to send
      await messageInput.press('Enter')
      
      console.log(`Message sent to ${phoneNumber}`)
      lastActivity = Date.now()
      
      return { success: true }
    } catch (error) {
      console.error("Error sending message:", error)
      await logErrorToDatabase("send_message", error.message)
      return { success: false, message: error.message }
    }
  }
}

// Database utility functions
async function updateWhatsAppConnection(isConnected: boolean, qrCode: string | null = null) {
  try {
    console.log("Updating connection status: connected =", isConnected, ", QR code =", qrCode ? "available" : "not available")
    
    const updateData: any = { 
      is_connected: isConnected,
      updated_at: new Date().toISOString()
    }
    
    if (isConnected) {
      updateData.last_connected_at = new Date().toISOString()
      updateData.qr_code = null
    }
    
    if (qrCode) {
      updateData.qr_code = qrCode
      console.log("QR code sent to database, length:", qrCode.length)
    }
    
    // First, get the existing record id
    const { data: existingRecord, error: queryError } = await supabase
      .from('whatsapp_connection')
      .select('id')
      .limit(1)
      .single()
    
    if (queryError) {
      console.error("Error querying connection record:", queryError)
      return
    }
    
    if (existingRecord) {
      console.log("Updating existing record:", existingRecord.id)
      await supabase
        .from('whatsapp_connection')
        .update(updateData)
        .eq('id', existingRecord.id)
    } else {
      // Create new record if none exists
      console.log("Creating new connection record")
      await supabase
        .from('whatsapp_connection')
        .insert({ ...updateData })
    }
    
    console.log("Connection status updated successfully")
  } catch (error) {
    console.error("Error updating WhatsApp connection:", error)
  }
}

async function logErrorToDatabase(errorType: string, errorMessage: string) {
  try {
    await supabase
      .from('whatsapp_errors')
      .insert({
        error_type: errorType,
        error_message: errorMessage,
        occurred_at: new Date().toISOString()
      })
  } catch (error) {
    console.error("Error logging to database:", error)
  }
}

async function processIncomingMessage(phoneNumber: string, message: string) {
  try {
    // Clean phone number format
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    
    // Check if this is an existing lead
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, assigned_to')
      .eq('phone_number', cleanPhone)
      .maybeSingle()
    
    if (existingLead) {
      // Add message to existing lead
      await supabase.from('messages').insert({
        lead_id: existingLead.id,
        message_text: message,
        direction: 'incoming',
        is_read: false
      })
    } else {
      // Create new lead
      const { data: newLead } = await supabase
        .from('leads')
        .insert({
          phone_number: cleanPhone,
          first_message: message,
          status: 'novo'
        })
        .select()
        .single()
      
      if (newLead) {
        // Add first message
        await supabase.from('messages').insert({
          lead_id: newLead.id,
          message_text: message,
          direction: 'incoming',
          is_read: false
        })
        
        // Auto-assign to a salesperson based on logic
        await assignLeadToSalesperson(newLead.id)
      }
    }
  } catch (error) {
    console.error("Error processing incoming message:", error)
  }
}

async function assignLeadToSalesperson(leadId: string) {
  try {
    // Get all salespeople
    const { data: salespeople } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'seller')
    
    if (salespeople && salespeople.length > 0) {
      // Simple round-robin assignment - in a real implementation, 
      // you might want more sophisticated logic
      const assignIndex = Math.floor(Math.random() * salespeople.length)
      const assignedTo = salespeople[assignIndex].id
      
      // Update lead with assigned salesperson
      await supabase
        .from('leads')
        .update({ assigned_to: assignedTo })
        .eq('id', leadId)
      
      // Record the assignment
      await supabase
        .from('lead_assignments')
        .insert({
          lead_id: leadId,
          assigned_to: assignedTo,
          notes: 'Atribuído automaticamente pelo sistema'
        })
    }
  } catch (error) {
    console.error("Error assigning lead to salesperson:", error)
  }
}

// HTTP request handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    // Parse request data
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || ''
    let requestData = {}
    
    if (req.method === 'POST') {
      try {
        requestData = await req.json()
      } catch (e) {
        console.error("Error parsing request JSON:", e)
        // Continue with empty request data if parse fails
      }
    }
    
    // Merge query params and body
    const data = { ...requestData, ...Object.fromEntries(url.searchParams) }
    console.log("Edge function received action:", action)
    
    // Route to appropriate handler based on action
    switch (action) {
      case 'connect':
        const connectResult = await client.connect()
        return new Response(JSON.stringify(connectResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
        
      case 'disconnect':
        const disconnectResult = await client.disconnect()
        return new Response(JSON.stringify(disconnectResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
        
      case 'reconnect':
        const reconnectResult = await client.reconnect()
        return new Response(JSON.stringify(reconnectResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
        
      case 'status':
        const statusResult = await client.getStatus()
        return new Response(JSON.stringify(statusResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
        
      case 'qrcode':
        // Only return QR code data
        return new Response(JSON.stringify({ qrCode }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
        
      case 'send_message':
        const { phoneNumber, message, leadId } = data as any
        
        if (!phoneNumber || !message) {
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'Phone number and message are required' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }
        
        const sendResult = await client.sendMessage(phoneNumber, message, leadId)
        
        if (sendResult.success && leadId) {
          // Store the sent message in the database
          await supabase.from('messages').insert({
            lead_id: leadId,
            message_text: message,
            direction: 'outgoing',
            sent_by: req.headers.get('x-user-id'),
            is_read: true
          })
        }
        
        return new Response(JSON.stringify(sendResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
        
      default:
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Invalid action' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
    }
  } catch (error) {
    console.error("Error in edge function:", error)
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
