
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'sonner';

export interface NotificationSetting {
  id: string;
  type: string;
  enabled: boolean;
}

export interface ScheduledReport {
  id: string;
  report_type: string;
  frequency: 'weekly' | 'monthly';
  enabled: boolean;
  last_sent_at?: string;
}

export function useNotificationSettings() {
  const { user } = useUsers();
  const [loading, setLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);

  // Fetch notification settings
  const fetchNotificationSettings = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setNotificationSettings(data as NotificationSetting[]);
      return data;
    } catch (error: any) {
      console.error('Error fetching notification settings:', error);
      toast.error('Erro ao carregar configurações de notificações');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update notification setting
  const updateNotificationSetting = async (settingId: string, enabled: boolean) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('notification_settings')
        .update({ enabled })
        .eq('id', settingId);

      if (error) throw error;
      
      // Update local state
      setNotificationSettings(prev => 
        prev.map(setting => 
          setting.id === settingId ? { ...setting, enabled } : setting
        )
      );
      
      toast.success('Configuração de notificação atualizada');
      return { success: true };
    } catch (error: any) {
      console.error('Error updating notification setting:', error);
      toast.error('Erro ao atualizar configuração de notificação');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Fetch scheduled reports
  const fetchScheduledReports = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('scheduled_reports')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setScheduledReports(data as ScheduledReport[]);
      return data;
    } catch (error: any) {
      console.error('Error fetching scheduled reports:', error);
      toast.error('Erro ao carregar relatórios programados');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update scheduled report
  const updateScheduledReport = async (reportId: string, enabled: boolean) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('scheduled_reports')
        .update({ enabled })
        .eq('id', reportId);

      if (error) throw error;
      
      // Update local state
      setScheduledReports(prev => 
        prev.map(report => 
          report.id === reportId ? { ...report, enabled } : report
        )
      );
      
      toast.success('Relatório programado atualizado');
      return { success: true };
    } catch (error: any) {
      console.error('Error updating scheduled report:', error);
      toast.error('Erro ao atualizar relatório programado');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Load settings when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchNotificationSettings();
      fetchScheduledReports();
    }
  }, [user?.id]);

  return {
    loading,
    notificationSettings,
    scheduledReports,
    fetchNotificationSettings,
    updateNotificationSetting,
    fetchScheduledReports,
    updateScheduledReport
  };
}
