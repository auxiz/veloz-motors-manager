
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/utils.ts";

const INFOSIMPLES_API_TOKEN = Deno.env.get("INFOSIMPLES_API_TOKEN") || "";
const API_URL = "https://api.infosimples.com/api/v2/consultas/veiculo-placa";

interface LicensePlateRequest {
  plate: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { plate } = await req.json() as LicensePlateRequest;
    
    if (!plate) {
      return new Response(
        JSON.stringify({ error: "Placa é obrigatória" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    if (!INFOSIMPLES_API_TOKEN) {
      return new Response(
        JSON.stringify({ error: "API token não configurado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Call the Infosimples API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: INFOSIMPLES_API_TOKEN,
        placa: plate,
        timeout: 60
      }),
    });
    
    const data = await response.json();
    
    // Add the plate to the vehicle data if response is successful
    if (data.success && data.result && data.result.veiculo) {
      data.result.veiculo.placa = plate;
    }
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
