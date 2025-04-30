
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { formatCurrency } from "../_shared/utils.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FinancingRequest {
  cpf: string;
  birthdate: string;
  whatsapp: string;
  hasCNH: boolean;
  vehiclePrice: number;
  entryValue: number;
  installments: number;
  monthlyPayment: number;
  totalPayment: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const requestData: FinancingRequest = await req.json();

    // Store request in database
    const { error } = await fetch(
      Deno.env.get("SUPABASE_URL") + "/rest/v1/financing_requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": Deno.env.get("SUPABASE_ANON_KEY") || "",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY") || ""}`
        },
        body: JSON.stringify({
          cpf: requestData.cpf,
          birthdate: requestData.birthdate,
          whatsapp: requestData.whatsapp,
          has_cnh: requestData.hasCNH,
          vehicle_price: requestData.vehiclePrice,
          entry_value: requestData.entryValue,
          installments: requestData.installments,
          monthly_payment: requestData.monthlyPayment,
          total_payment: requestData.totalPayment
        })
      }
    ).then(r => r.json());

    if (error) {
      throw new Error(`Failed to store financing request: ${error}`);
    }

    // Simple HTML email template
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #e6a817;">Nova Solicitação de Financiamento</h2>
            <p>Uma nova solicitação de financiamento foi recebida.</p>
            
            <h3>Dados Pessoais:</h3>
            <ul>
              <li><strong>CPF:</strong> ${requestData.cpf}</li>
              <li><strong>Data de Nascimento:</strong> ${formatDate(requestData.birthdate)}</li>
              <li><strong>WhatsApp:</strong> ${requestData.whatsapp}</li>
              <li><strong>Possui CNH:</strong> ${requestData.hasCNH ? 'Sim' : 'Não'}</li>
            </ul>
            
            <h3>Dados do Financiamento:</h3>
            <ul>
              <li><strong>Valor do Veículo:</strong> ${formatCurrency(requestData.vehiclePrice)}</li>
              <li><strong>Valor de Entrada:</strong> ${formatCurrency(requestData.entryValue)}</li>
              <li><strong>Número de Parcelas:</strong> ${requestData.installments}</li>
              <li><strong>Valor da Parcela:</strong> ${formatCurrency(requestData.monthlyPayment)}</li>
              <li><strong>Valor Total:</strong> ${formatCurrency(requestData.totalPayment)}</li>
            </ul>
            
            <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
              Este é um email automático gerado pelo sistema da Veloz Motors.
            </p>
          </div>
        </body>
      </html>
    `;

    // Send email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "Veloz Motors <financiamento@velozmotors.com>",
        to: ["financiamento@velozmotors.com"], // Replace with actual email
        subject: "Nova Solicitação de Financiamento",
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(`Failed to send email: ${JSON.stringify(emailData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email enviado com sucesso" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error("Error sending financing email:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
