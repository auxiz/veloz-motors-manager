
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ScheduledReport, ReportType, ReportFrequency } from '@/types/reports';
import { useUsers } from './useUsers';

export const useScheduledReports = () => {
  const queryClient = useQueryClient();
  const { user } = useUsers();

  // Get all scheduled reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['scheduled_reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching scheduled reports:', error);
        toast.error('Erro ao carregar relatórios programados');
        throw error;
      }

      return data as ScheduledReport[];
    },
  });

  // Create a new scheduled report
  const createReport = useMutation({
    mutationFn: async (reportData: Omit<ScheduledReport, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const newReport = {
        ...reportData,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('scheduled_reports')
        .insert([newReport])
        .select()
        .single();

      if (error) {
        console.error('Error creating scheduled report:', error);
        toast.error('Erro ao criar relatório programado');
        throw error;
      }

      toast.success('Relatório programado criado com sucesso');
      return data as ScheduledReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled_reports'] });
    },
  });

  // Update a scheduled report
  const updateReport = useMutation({
    mutationFn: async ({ id, ...reportData }: Partial<ScheduledReport> & { id: string }) => {
      const { data, error } = await supabase
        .from('scheduled_reports')
        .update(reportData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating scheduled report:', error);
        toast.error('Erro ao atualizar relatório programado');
        throw error;
      }

      toast.success('Relatório programado atualizado com sucesso');
      return data as ScheduledReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled_reports'] });
    },
  });

  // Toggle report enabled status
  const toggleReportStatus = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { data, error } = await supabase
        .from('scheduled_reports')
        .update({ enabled })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling report status:', error);
        toast.error('Erro ao alternar status do relatório');
        throw error;
      }

      toast.success(`Relatório ${enabled ? 'ativado' : 'desativado'} com sucesso`);
      return data as ScheduledReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled_reports'] });
    },
  });

  // Delete a scheduled report
  const deleteReport = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scheduled_reports')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting scheduled report:', error);
        toast.error('Erro ao excluir relatório programado');
        throw error;
      }

      toast.success('Relatório programado excluído com sucesso');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled_reports'] });
    },
  });

  return {
    reports,
    isLoading,
    createReport,
    updateReport,
    toggleReportStatus,
    deleteReport,
  };
};
