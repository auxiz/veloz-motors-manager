
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lead } from './types';

export const useLeads = (userId: string | undefined) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Use RPC function instead of direct table access
      const { data, error } = await supabase
        .rpc('get_leads', { current_user_id: userId || null });
      
      if (error) {
        throw error;
      }
      
      setLeads(data as Lead[]);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Falha ao carregar leads');
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (leadId: string, updates: Partial<Lead>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId);
        
      if (error) {
        throw error;
      }
      
      toast.success('Lead atualizado com sucesso');
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Falha ao atualizar lead');
    }
  };

  return {
    leads,
    loading,
    fetchLeads,
    updateLead,
    setLeads
  };
};
