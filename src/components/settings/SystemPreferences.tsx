
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, Save, Loader2 } from 'lucide-react';
import { useSystemPreferences } from '@/hooks/useSystemPreferences';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';

const SystemPreferences = () => {
  const { preferences, updatePreferences, loading: prefsLoading } = useSystemPreferences();
  const { 
    notificationSettings, 
    scheduledReports,
    updateNotificationSetting, 
    updateScheduledReport,
    loading: notifLoading 
  } = useNotificationSettings();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formValues, setFormValues] = useState({
    currency: 'BRL',
    commissionType: 'percentage',
    defaultPaymentTerms: '30',
    monthlySalesTargetAmount: '100000',
    monthlySalesTargetVehicles: '10',
  });

  useEffect(() => {
    if (preferences) {
      setFormValues({
        currency: preferences.currency || 'BRL',
        commissionType: preferences.commission_type || 'percentage',
        defaultPaymentTerms: preferences.default_payment_terms?.toString() || '30',
        monthlySalesTargetAmount: preferences.sales_targets?.monthly_amount?.toString() || '100000',
        monthlySalesTargetVehicles: preferences.sales_targets?.monthly_vehicles?.toString() || '10',
      });
    }
  }, [preferences]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = async (settingId: string, checked: boolean) => {
    await updateNotificationSetting(settingId, checked);
  };

  const handleReportToggle = async (reportId: string, checked: boolean) => {
    await updateScheduledReport(reportId, checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      await updatePreferences({
        currency: formValues.currency,
        commission_type: formValues.commissionType,
        default_payment_terms: parseInt(formValues.defaultPaymentTerms),
        sales_targets: {
          monthly_amount: parseInt(formValues.monthlySalesTargetAmount),
          monthly_vehicles: parseInt(formValues.monthlySalesTargetVehicles)
        }
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNotificationLabel = (type: string) => {
    switch (type) {
      case 'vehicles_older_than_90_days':
        return 'Veículos em estoque por mais de 90 dias';
      case 'sales_pending_completion':
        return 'Vendas pendentes de conclusão';
      case 'payments_overdue':
        return 'Pagamentos em atraso';
      case 'new_customer_registrations':
        return 'Novos cadastros de clientes';
      default:
        return type;
    }
  };

  const getNotificationDescription = (type: string) => {
    switch (type) {
      case 'vehicles_older_than_90_days':
        return 'Receba alertas sobre veículos com tempo prolongado em estoque';
      case 'sales_pending_completion':
        return 'Receba alertas sobre vendas que precisam ser finalizadas';
      case 'payments_overdue':
        return 'Receba alertas sobre pagamentos que estão em atraso';
      case 'new_customer_registrations':
        return 'Receba alertas quando novos clientes forem cadastrados';
      default:
        return '';
    }
  };

  const loading = prefsLoading || notifLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Settings className="mr-2 h-6 w-6 text-veloz-yellow" />
          Preferências do Sistema
        </CardTitle>
        <CardDescription>
          Configure as preferências gerais do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Configurações Gerais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda Padrão</Label>
                  <Select 
                    value={formValues.currency} 
                    onValueChange={(value) => handleSelectChange('currency', value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Selecione uma moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar (US$)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commissionType">Tipo de Comissão</Label>
                  <Select 
                    value={formValues.commissionType} 
                    onValueChange={(value) => handleSelectChange('commissionType', value)}
                  >
                    <SelectTrigger id="commissionType">
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultPaymentTerms">Prazo de Pagamento Padrão (dias)</Label>
                  <Input
                    id="defaultPaymentTerms"
                    name="defaultPaymentTerms"
                    type="number"
                    value={formValues.defaultPaymentTerms}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Notificações</h3>
              <div className="space-y-4">
                {notificationSettings.map(setting => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{getNotificationLabel(setting.type)}</p>
                      <p className="text-sm text-muted-foreground">{getNotificationDescription(setting.type)}</p>
                    </div>
                    <Switch 
                      checked={setting.enabled}
                      onCheckedChange={(checked) => handleNotificationToggle(setting.id, checked)}
                    />
                  </div>
                ))}

                {notificationSettings.length === 0 && (
                  <p className="text-muted-foreground italic">Nenhuma configuração de notificação encontrada.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Metas de Vendas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlySalesTargetAmount">Meta Mensal de Vendas (R$)</Label>
                  <Input
                    id="monthlySalesTargetAmount"
                    name="monthlySalesTargetAmount"
                    type="number"
                    value={formValues.monthlySalesTargetAmount}
                    onChange={handleInputChange}
                    // prefix would be nice to have but not in this version of the component
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthlySalesTargetVehicles">Meta Mensal (Qtd. Veículos)</Label>
                  <Input
                    id="monthlySalesTargetVehicles"
                    name="monthlySalesTargetVehicles"
                    type="number"
                    value={formValues.monthlySalesTargetVehicles}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Relatórios Programados</h3>
              <div className="space-y-4">
                {scheduledReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Relatório {report.frequency === 'weekly' ? 'Semanal' : 'Mensal'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Envio automático de relatórios {report.frequency === 'weekly' ? 'semanais' : 'mensais'} por email
                      </p>
                    </div>
                    <Switch 
                      checked={report.enabled}
                      onCheckedChange={(checked) => handleReportToggle(report.id, checked)}
                    />
                  </div>
                ))}

                {scheduledReports.length === 0 && (
                  <p className="text-muted-foreground italic">Nenhum relatório programado encontrado.</p>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Preferências
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemPreferences;
