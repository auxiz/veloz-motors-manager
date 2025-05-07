
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from './config';
import { actionHandlers } from './whatsapp-actions';

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
    if (action && actionHandlers[action]) {
      const result = await actionHandlers[action](data);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
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
