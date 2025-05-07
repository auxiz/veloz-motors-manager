
import { whatsAppClient } from './client-state';
import { supabase } from './database';
import { config } from './config';
import { logError, assignLeadToSalesperson } from './database';

export async function sendMessage(
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

export async function checkNumberRegistration(phoneNumber: string): Promise<boolean> {
  try {
    // This is a simplistic check - in a real implementation, use client.isRegisteredUser
    // For now, we'll just assume true
    return true;
  } catch (error) {
    console.error("Error checking number registration:", error);
    return true; // Default to true to attempt sending anyway
  }
}

export async function processIncomingMessage(phoneNumber: string, message: string): Promise<void> {
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
