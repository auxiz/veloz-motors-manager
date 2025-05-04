
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts"

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const supabase = createClient(supabaseUrl, supabaseKey)

interface WhatsAppMessage {
  phoneNumber: string;
  message: string;
  timestamp: number;
}

let browser: any = null
let page: any = null
let isConnected = false
let qrCode: string | null = null

async function initBrowser() {
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
    
    console.log("Navigating to WhatsApp Web...")
    await page.goto('https://web.whatsapp.com/', { waitUntil: 'networkidle2' })
    
    // Wait for QR code to appear
    await page.waitForSelector('canvas[aria-label="Scan me!"]', { timeout: 20000 })
    
    // Get QR code data
    qrCode = await page.evaluate(() => {
      const canvas = document.querySelector('canvas[aria-label="Scan me!"]')
      return canvas?.toDataURL() || null
    })
    
    console.log("QR code generated")
    
    // Update QR code in database
    await updateWhatsAppConnection(false, qrCode)
    
    // Wait for WhatsApp to be ready
    await page.waitForSelector('div[data-testid="chat-list"]', { timeout: 0 }).then(() => {
      console.log("WhatsApp Web logged in successfully!")
      isConnected = true
      updateWhatsAppConnection(true)
    }).catch(err => {
      console.error("Error while waiting for WhatsApp to load:", err)
      isConnected = false
    })
    
    // Set up message listeners once connected
    if (isConnected) {
      setupMessageListeners()
    }
    
  } catch (error) {
    console.error("Error initializing browser:", error)
    await closeBrowser()
  }
}

async function setupMessageListeners() {
  console.log("Setting up message listeners...")
  
  // Monitor for new messages
  await page.exposeFunction('onNewMessage', async (phoneNumber: string, message: string) => {
    console.log(`New message from ${phoneNumber}: ${message}`)
    await processIncomingMessage(phoneNumber, message)
  })
  
  // Inject listener for new messages
  await page.evaluate(() => {
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          // This is a simplified example - in a real implementation you'd need
          // to parse the HTML to extract phone numbers and messages
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
          status: 'new'
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
        
        // Auto-assign to a salesperson based on your logic
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
          notes: 'Auto-assigned by system'
        })
    }
  } catch (error) {
    console.error("Error assigning lead to salesperson:", error)
  }
}

async function updateWhatsAppConnection(isConnected: boolean, qrCode: string | null = null) {
  try {
    const updateData: any = { 
      is_connected: isConnected
    }
    
    if (isConnected) {
      updateData.last_connected_at = new Date().toISOString()
    }
    
    if (qrCode) {
      updateData.qr_code = qrCode
    }
    
    await supabase
      .from('whatsapp_connection')
      .update(updateData)
      .eq('id', (await supabase.from('whatsapp_connection').select('id').single()).data?.id)
    
  } catch (error) {
    console.error("Error updating WhatsApp connection:", error)
  }
}

async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  if (!isConnected || !page) {
    console.error("WhatsApp is not connected")
    return false
  }
  
  try {
    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    
    // Open chat with this contact
    await page.goto(`https://web.whatsapp.com/send?phone=${cleanPhone}`, { waitUntil: 'networkidle2' })
    
    // Wait for chat to load
    await page.waitForSelector('#main', { timeout: 10000 })
    
    // Type and send message
    const messageInput = await page.waitForSelector('div[contenteditable="true"][data-testid="conversation-compose-box-input"]')
    await messageInput.type(message)
    
    // Press Enter to send
    await messageInput.press('Enter')
    
    console.log(`Message sent to ${phoneNumber}`)
    return true
  } catch (error) {
    console.error("Error sending message:", error)
    return false
  }
}

async function closeBrowser() {
  if (browser) {
    try {
      await browser.close()
      browser = null
      page = null
      isConnected = false
      await updateWhatsAppConnection(false)
      console.log("Browser closed")
    } catch (error) {
      console.error("Error closing browser:", error)
    }
  }
}

serve(async (req) => {
  const url = new URL(req.url)
  const path = url.pathname
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      status: 204,
    })
  }

  try {
    if (path === '/connect' && req.method === 'POST') {
      if (!browser) {
        await initBrowser()
        return new Response(JSON.stringify({ success: true, qrCode }), {
          headers: { 'Content-Type': 'application/json' },
        })
      } else {
        return new Response(JSON.stringify({ success: true, message: 'Already initialized', isConnected }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }
    } 
    else if (path === '/status' && req.method === 'GET') {
      return new Response(JSON.stringify({ isConnected }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    else if (path === '/disconnect' && req.method === 'POST') {
      await closeBrowser()
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    else if (path === '/send' && req.method === 'POST') {
      if (!isConnected) {
        return new Response(JSON.stringify({ success: false, message: 'WhatsApp is not connected' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        })
      }
      
      const { phoneNumber, message, leadId } = await req.json()
      
      if (!phoneNumber || !message) {
        return new Response(JSON.stringify({ success: false, message: 'Phone number and message are required' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        })
      }
      
      const success = await sendWhatsAppMessage(phoneNumber, message)
      
      if (success && leadId) {
        // Store the sent message in the database
        await supabase.from('messages').insert({
          lead_id: leadId,
          message_text: message,
          direction: 'outgoing',
          sent_by: req.headers.get('x-user-id'),
          is_read: true
        })
      }
      
      return new Response(JSON.stringify({ success }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    return new Response(JSON.stringify({ error: 'Not found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404,
    })
  } catch (error) {
    console.error("Error in edge function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
