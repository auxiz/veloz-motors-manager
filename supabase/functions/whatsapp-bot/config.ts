
import { Config } from './types';

// Configuration settings for the WhatsApp bot
export const config: Config = {
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

// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
