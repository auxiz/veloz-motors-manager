
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lead } from './types';

export const useLeads = (userId: string | undefined) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const fetchLeads = async () => {
    // Don't fetch if not logged in (no userId)
    if (!userId) return;

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

  // Function to set a new random interval
  const scheduleNextRefresh = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Random time between 3 and 5 minutes (180,000 to 300,000 ms)
    const randomInterval = Math.floor(Math.random() * (300000 - 180000 + 1)) + 180000;
    console.log(`Next leads refresh in ${(randomInterval / 60000).toFixed(1)} minutes`);
    
    timerRef.current = setTimeout(() => {
      if (autoRefreshEnabled && userId) {
        fetchLeads();
      }
      // After fetching, schedule next refresh
      scheduleNextRefresh();
    }, randomInterval);
  };

  // Toggle auto-refresh functionality
  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(prev => !prev);
  };

  // Set up initial fetch and interval when component mounts or userId changes
  useEffect(() => {
    // Only fetch if userId exists (user is logged in)
    if (userId) {
      fetchLeads();
      scheduleNextRefresh();
    }
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [userId]);

  return {
    leads,
    loading,
    fetchLeads,
    updateLead,
    setLeads,
    autoRefreshEnabled,
    toggleAutoRefresh
  };
};
