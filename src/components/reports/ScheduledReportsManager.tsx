
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, Plus, RefreshCcw, Clock } from 'lucide-react';
import { useScheduledReports } from '@/hooks/useScheduledReports';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ReportType, ReportFrequency } from '@/types/reports';

const reportTypeLabels: Record<ReportType, string> = {
  'sales': 'Vendas',
  'inventory': 'Estoque',
  'financial': 'Financeiro',
  'performance': 'Desempenho',
};

const frequencyLabels: Record<ReportFrequency, string> = {
  'daily': 'Diário',
  'weekly': 'Semanal',
  'monthly': 'Mensal',
};

export function ScheduledReportsManager() {
  const { 
    reports, 
    isLoading, 
    createReport,
    updateReport,
    toggleReportStatus,
    deleteReport 
  } = useScheduledReports();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);
  
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [frequency, setFrequency] = useState<ReportFrequency>('weekly');

  const handleCreateReport = () => {
    setIsEditing(false);
    setReportType('sales');
    setFrequency('weekly');
    setDialogOpen(true);
  };

  const handleEditReport = (report: any) => {
    setIsEditing(true);
    setCurrentReport(report);
    setReportType(report.report_type);
    setFrequency(report.frequency);
    setDialogOpen(true);
  };

  const handleSaveReport = () => {
    if (isEditing && currentReport) {
      updateReport.mutate({
        id: currentReport.id,
        report_type: reportType,
        frequency: frequency
      });
    } else {
      createReport.mutate({
        report_type: reportType,
        frequency: frequency,
        enabled: true
      });
    }
    setDialogOpen(false);
  };

  const handleDeleteReport = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este relatório programado?')) {
      deleteReport.mutate(id);
    }
  };

  const handleToggleStatus = (id: string, enabled: boolean) => {
    toggleReportStatus.mutate({ id, enabled: !enabled });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCcw className="h-8 w-8 animate-spin text-veloz-yellow" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Relatórios Automáticos</CardTitle>
            <CardDescription>
              Configure relatórios para serem gerados e enviados automaticamente
            </CardDescription>
          </div>
          <Button 
            onClick={handleCreateReport}
            className="bg-veloz-yellow hover:bg-yellow-500 text-black font-bold mt-4 md:mt-0"
          >
            <Plus className="mr-2 h-4 w-4" /> Agendar Novo Relatório
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Nenhum relatório agendado</h3>
            <p className="text-muted-foreground mt-2">
              Agende relatórios para serem gerados e enviados automaticamente
            </p>
            <Button
              onClick={handleCreateReport}
              className="bg-veloz-yellow hover:bg-yellow-500 text-black font-bold mt-4"
            >
              Agendar Primeiro Relatório
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Execução</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {reportTypeLabels[report.report_type as ReportType] || report.report_type}
                  </TableCell>
                  <TableCell>
                    {frequencyLabels[report.frequency as ReportFrequency] || report.frequency}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={report.enabled} 
                        onCheckedChange={() => handleToggleStatus(report.id, report.enabled)}
                      />
                      <span>{report.enabled ? 'Ativo' : 'Inativo'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {report.last_sent_at 
                      ? format(parseISO(report.last_sent_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                      : 'Nunca executado'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditReport(report)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteReport(report.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Dialog for creating/editing reports */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Relatório Programado' : 'Novo Relatório Programado'}
            </DialogTitle>
            <DialogDescription>
              Configure os detalhes do relatório automático
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-type" className="text-right">
                Tipo
              </Label>
              <div className="col-span-3">
                <Select
                  value={reportType}
                  onValueChange={(value) => setReportType(value as ReportType)}
                >
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Selecione o tipo de relatório" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Vendas</SelectItem>
                    <SelectItem value="inventory">Estoque</SelectItem>
                    <SelectItem value="financial">Financeiro</SelectItem>
                    <SelectItem value="performance">Desempenho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequência
              </Label>
              <div className="col-span-3">
                <Select
                  value={frequency}
                  onValueChange={(value) => setFrequency(value as ReportFrequency)}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveReport}
              className="bg-veloz-yellow hover:bg-yellow-500 text-black font-bold"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
