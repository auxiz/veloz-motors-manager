
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SystemPreferences {
  currency: string;
  commission_type: string;
  default_payment_terms: number;
  sales_targets: {
    monthly_amount: number;
    monthly_vehicles: number;
  };
}

export function useSystemPreferences() {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<SystemPreferences>({
    currency: 'BRL',
    commission_type: 'percentage',
    default_payment_terms: 30,
    sales_targets: {
      monthly_amount: 100000,
      monthly_vehicles: 10
    }
  });

  // Fetch system preferences
  const fetchPreferences = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('system_preferences')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        const processedPrefs: any = {};
        
        data.forEach((pref) => {
          if (pref.key === 'sales_targets') {
            // Parse JSON value
            processedPrefs[pref.key] = typeof pref.value === 'string' 
              ? JSON.parse(pref.value) 
              : pref.value;
          } else {
            // For simple values, remove quotes if it's a string
            const value = pref.value;
            processedPrefs[pref.key] = typeof value === 'string' && value.startsWith('"') && value.endsWith('"')
              ? value.slice(1, -1) 
              : value;
          }
        });
        
        setPreferences({
          ...preferences,
          ...processedPrefs
        });
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching system preferences:', error);
      toast.error('Erro ao buscar preferências do sistema');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update system preferences
  const updatePreferences = async (updates: Partial<SystemPreferences>) => {
    try {
      setLoading(true);
      
      // Process each key/value pair
      for (const [key, value] of Object.entries(updates)) {
        const { error } = await supabase
          .from('system_preferences')
          .update({ value: JSON.stringify(value) })
          .eq('key', key);

        if (error) throw error;
      }
      
      toast.success('Preferências atualizadas com sucesso');
      
      // Refresh preferences
      await fetchPreferences();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating system preferences:', error);
      toast.error('Erro ao atualizar preferências do sistema');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Load preferences when component mounts
  useEffect(() => {
    fetchPreferences();
  }, []);

  return {
    loading,
    preferences,
    fetchPreferences,
    updatePreferences
  };
}
