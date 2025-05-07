
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { whatsAppClient } from './client-state';
import { config } from './config';
import { logError } from './database';

export async function initializeBrowser() {
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

export async function cleanupResources(): Promise<void> {
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
