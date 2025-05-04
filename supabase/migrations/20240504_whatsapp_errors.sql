
-- Create a table to track WhatsApp errors
CREATE TABLE IF NOT EXISTS public.whatsapp_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT
);

-- Add an index to help querying by error_type
CREATE INDEX IF NOT EXISTS whatsapp_errors_error_type_idx ON public.whatsapp_errors (error_type);

-- Add an index for queries by time interval
CREATE INDEX IF NOT EXISTS whatsapp_errors_occurred_at_idx ON public.whatsapp_errors (occurred_at);

-- Update the existing whatsapp_connection table with reconnect metrics
ALTER TABLE public.whatsapp_connection 
ADD COLUMN IF NOT EXISTS reconnect_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_error TEXT,
ADD COLUMN IF NOT EXISTS last_error_at TIMESTAMP WITH TIME ZONE;
