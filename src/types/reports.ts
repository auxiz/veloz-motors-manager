
// Report types for the scheduled reports
export type ReportFrequency = 'daily' | 'weekly' | 'monthly';

export type ReportType = 'sales' | 'inventory' | 'financial' | 'performance';

export interface ScheduledReport {
  id: string;
  report_type: ReportType;
  frequency: ReportFrequency;
  enabled: boolean;
  user_id?: string;
  last_sent_at?: string;
  created_at?: string;
  updated_at?: string;
}
