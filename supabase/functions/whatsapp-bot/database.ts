
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import { config } from './config';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function storeConnectionData(data: Record<string, any>): Promise<void> {
  try {
    // Get the existing record id
    const { data: existingRecord, error: queryError } = await supabase
      .from(config.database.connectionTableName)
      .select('id')
      .limit(1)
      .single();
    
    if (queryError) {
      console.error("Error querying connection record:", queryError);
      return;
    }
    
    // Add timestamp
    data.updated_at = new Date().toISOString();
    
    if (existingRecord) {
      console.log("Updating existing connection record");
      await supabase
        .from(config.database.connectionTableName)
        .update(data)
        .eq('id', existingRecord.id);
    } else {
      // Create new record if none exists
      console.log("Creating new connection record");
      await supabase
        .from(config.database.connectionTableName)
        .insert({ ...data });
    }
  } catch (error) {
    console.error("Error updating WhatsApp connection data:", error);
  }
}

export async function logError(errorType: string, errorMessage: string): Promise<void> {
  try {
    await supabase
      .from(config.database.errorsTableName)
      .insert({
        error_type: errorType,
        error_message: errorMessage,
        occurred_at: new Date().toISOString()
      });
  } catch (error) {
    console.error("Error logging to database:", error);
  }
}

export async function assignLeadToSalesperson(leadId: string): Promise<void> {
  try {
    // Get all salespeople
    const { data: salespeople } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'seller');
    
    if (salespeople && salespeople.length > 0) {
      // Simple round-robin assignment
      const assignIndex = Math.floor(Math.random() * salespeople.length);
      const assignedTo = salespeople[assignIndex].id;
      
      // Update lead with assigned salesperson
      await supabase
        .from(config.database.leadsTableName)
        .update({ assigned_to: assignedTo })
        .eq('id', leadId);
      
      // Record the assignment
      await supabase
        .from('lead_assignments')
        .insert({
          lead_id: leadId,
          assigned_to: assignedTo,
          notes: 'Atribuído automaticamente pelo sistema'
        });
    }
  } catch (error) {
    console.error("Error assigning lead to salesperson:", error);
    await logError("lead_assignment", error.message);
  }
}
