
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function initBrowser() {
  try {
    console.log("Inicializando navegador...")
    
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
    
    console.log("Navegando para o WhatsApp Web...")
    await page.goto('https://web.whatsapp.com/', { waitUntil: 'networkidle2' })
    
    // Wait for QR code to appear
    await page.waitForSelector('canvas[aria-label="Scan me!"]', { timeout: 20000 })
    
    // Get QR code data
    qrCode = await page.evaluate(() => {
      const canvas = document.querySelector('canvas[aria-label="Scan me!"]')
      return canvas?.toDataURL() || null
    })
    
    console.log("QR code gerado")
    
    // Update QR code in database
    await updateWhatsAppConnection(false, qrCode)
    
    // Wait for WhatsApp to be ready
    await page.waitForSelector('div[data-testid="chat-list"]', { timeout: 0 }).then(() => {
      console.log("WhatsApp Web conectado com sucesso!")
      isConnected = true
      updateWhatsAppConnection(true)
    }).catch(err => {
      console.error("Erro ao aguardar carregamento do WhatsApp:", err)
      isConnected = false
    })
    
    // Set up message listeners once connected
    if (isConnected) {
      setupMessageListeners()
    }
    
  } catch (error) {
    console.error("Erro ao inicializar navegador:", error)
    await closeBrowser()
  }
}

async function setupMessageListeners() {
  console.log("Configurando ouvintes de mensagem...")
  
  // Monitor for new messages
  await page.exposeFunction('onNewMessage', async (phoneNumber: string, message: string) => {
    console.log(`Nova mensagem de ${phoneNumber}: ${message}`)
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
        
        // Auto-assign to a salesperson based on your logic
        await assignLeadToSalesperson(newLead.id)
      }
    }
  } catch (error) {
    console.error("Erro ao processar mensagem recebida:", error)
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
    console.error("Erro ao atribuir lead ao vendedor:", error)
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
    
    // First, get the existing record id
    const { data: existingRecord, error: queryError } = await supabase
      .from('whatsapp_connection')
      .select('id')
      .limit(1)
      .single()
    
    if (queryError) {
      console.error("Erro ao buscar registro de conexão:", queryError)
      return
    }
    
    if (existingRecord) {
      await supabase
        .from('whatsapp_connection')
        .update(updateData)
        .eq('id', existingRecord.id)
    } else {
      // Create new record if none exists
      await supabase
        .from('whatsapp_connection')
        .insert({ ...updateData })
    }
    
  } catch (error) {
    console.error("Erro ao atualizar conexão do WhatsApp:", error)
  }
}

async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  if (!isConnected || !page) {
    console.error("WhatsApp não está conectado")
    return false
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
    
    console.log(`Mensagem enviada para ${phoneNumber}`)
    return true
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
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
      console.log("Navegador fechado")
    } catch (error) {
      console.error("Erro ao fechar navegador:", error)
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    const { action, phoneNumber, message, leadId } = await req.json()
    
    if (action === 'connect') {
      if (!browser) {
        await initBrowser()
        return new Response(JSON.stringify({ success: true, qrCode }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      } else {
        return new Response(JSON.stringify({ success: true, message: 'Já inicializado', isConnected }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } 
    else if (action === 'status') {
      return new Response(JSON.stringify({ isConnected }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    else if (action === 'disconnect') {
      await closeBrowser()
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    else if (phoneNumber && message) {
      if (!isConnected) {
        return new Response(JSON.stringify({ success: false, message: 'WhatsApp não está conectado' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    return new Response(JSON.stringify({ error: 'Ação não reconhecida' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  } catch (error) {
    console.error("Erro na função edge:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
