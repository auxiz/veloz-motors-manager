
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SystemPreferences = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    currency: 'BRL',
    commissionType: 'percentage',
    defaultPaymentTerms: '30',
    notifyVehiclesOlderThan90Days: true,
    notifySalesPendingCompletion: true,
    notifyPaymentsOverdue: true,
    notifyNewCustomerRegistrations: false,
    monthlySalesTargetAmount: '100000',
    monthlySalesTargetVehicles: '10',
    weeklyReportEnabled: false,
    monthlyReportEnabled: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Preferências salvas",
      description: "As configurações do sistema foram atualizadas com sucesso.",
    });
  };

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Configurações Gerais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda Padrão</Label>
                <Select 
                  value={preferences.currency} 
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
                  value={preferences.commissionType} 
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
                  value={preferences.defaultPaymentTerms}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Notificações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Veículos em estoque por mais de 90 dias</p>
                  <p className="text-sm text-muted-foreground">Receba alertas sobre veículos com tempo prolongado em estoque</p>
                </div>
                <Switch 
                  checked={preferences.notifyVehiclesOlderThan90Days}
                  onCheckedChange={(checked) => handleSwitchChange('notifyVehiclesOlderThan90Days', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Vendas pendentes de conclusão</p>
                  <p className="text-sm text-muted-foreground">Receba alertas sobre vendas que precisam ser finalizadas</p>
                </div>
                <Switch 
                  checked={preferences.notifySalesPendingCompletion}
                  onCheckedChange={(checked) => handleSwitchChange('notifySalesPendingCompletion', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pagamentos em atraso</p>
                  <p className="text-sm text-muted-foreground">Receba alertas sobre pagamentos que estão em atraso</p>
                </div>
                <Switch 
                  checked={preferences.notifyPaymentsOverdue}
                  onCheckedChange={(checked) => handleSwitchChange('notifyPaymentsOverdue', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novos cadastros de clientes</p>
                  <p className="text-sm text-muted-foreground">Receba alertas quando novos clientes forem cadastrados</p>
                </div>
                <Switch 
                  checked={preferences.notifyNewCustomerRegistrations}
                  onCheckedChange={(checked) => handleSwitchChange('notifyNewCustomerRegistrations', checked)}
                />
              </div>
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
                  value={preferences.monthlySalesTargetAmount}
                  onChange={handleInputChange}
                  prefix="R$"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthlySalesTargetVehicles">Meta Mensal (Qtd. Veículos)</Label>
                <Input
                  id="monthlySalesTargetVehicles"
                  name="monthlySalesTargetVehicles"
                  type="number"
                  value={preferences.monthlySalesTargetVehicles}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Relatórios Programados</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Relatório Semanal</p>
                  <p className="text-sm text-muted-foreground">Envio automático de relatórios semanais por email</p>
                </div>
                <Switch 
                  checked={preferences.weeklyReportEnabled}
                  onCheckedChange={(checked) => handleSwitchChange('weeklyReportEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Relatório Mensal</p>
                  <p className="text-sm text-muted-foreground">Envio automático de relatórios mensais por email</p>
                </div>
                <Switch 
                  checked={preferences.monthlyReportEnabled}
                  onCheckedChange={(checked) => handleSwitchChange('monthlyReportEnabled', checked)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar Preferências
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SystemPreferences;
