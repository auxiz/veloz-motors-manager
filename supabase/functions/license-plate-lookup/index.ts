
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/utils.ts";

const INFOSIMPLES_API_TOKEN = Deno.env.get("INFOSIMPLES_API_TOKEN") || "rvSsjZr1wKYGNi9-qi0MEDsS25W5y-RxbB15KUPi";
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
        JSON.stringify({ success: false, message: "Placa é obrigatória" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Requesting plate information for: ${plate}`);
    
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
    console.log("API response received:", JSON.stringify(data).substring(0, 200) + "...");
    
    // Add the plate to the vehicle data if response is successful
    if (data.success && data.result && data.result.veiculo) {
      data.result.veiculo.placa = plate;
    }
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in license-plate-lookup function:", error);
    return new Response(
      JSON.stringify({ success: false, message: `Erro ao processar requisição: ${error.message}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
