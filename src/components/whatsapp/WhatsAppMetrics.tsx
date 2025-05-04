
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useWhatsAppContext } from '@/hooks/whatsapp/useWhatsAppContext';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ErrorLog {
  id: string;
  error_type: string;
  error_message: string;
  occurred_at: string;
  resolved: boolean;
}

const WhatsAppMetrics: React.FC = () => {
  const { connectionStatus, metrics, checkConnectionStatus } = useWhatsAppContext();
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchErrors = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_errors')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Error fetching WhatsApp errors:', error);
        return;
      }
      
      setErrors(data || []);
    } catch (error) {
      console.error('Error fetching WhatsApp errors:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchErrors();
    
    // Set up polling for errors every minute
    const intervalId = setInterval(() => {
      fetchErrors();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleRefresh = async () => {
    await checkConnectionStatus();
    await fetchErrors();
  };
  
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('pt-BR');
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  return (
    <Card className="bg-veloz-gray text-white border-veloz-gray">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertCircle className="text-yellow-500" size={20} />
          Métricas e Diagnósticos do WhatsApp
        </CardTitle>
        <CardDescription className="text-gray-400">
          Informações detalhadas sobre a conexão e histórico de erros
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Connection Metrics */}
          <div className="bg-veloz-black rounded-md p-4">
            <h3 className="text-md font-semibold mb-3">Status da Conexão</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-veloz-gray p-3 rounded">
                <p className="text-xs text-gray-400">Status</p>
                <p className="font-medium">
                  {connectionStatus === 'connected' ? 'Conectado' : 
                   connectionStatus === 'connecting' ? 'Conectando...' : 
                   connectionStatus === 'disconnected' ? 'Desconectado' : 'Desconhecido'}
                </p>
              </div>
              
              <div className="bg-veloz-gray p-3 rounded">
                <p className="text-xs text-gray-400">Última Atividade</p>
                <p className="font-medium">
                  {metrics?.lastActivity 
                    ? formatDate(new Date(metrics.lastActivity).toISOString())
                    : 'Não disponível'}
                </p>
              </div>
              
              <div className="bg-veloz-gray p-3 rounded">
                <p className="text-xs text-gray-400">Tentativas de Reconexão</p>
                <p className="font-medium">{metrics?.reconnectAttempts || 0}</p>
              </div>
              
              <div className="bg-veloz-gray p-3 rounded">
                <p className="text-xs text-gray-400">Fila de Mensagens</p>
                <p className="font-medium">{metrics?.messageQueueSize || 0}</p>
              </div>
            </div>
          </div>
          
          {/* Error History */}
          <div className="bg-veloz-black rounded-md p-4">
            <h3 className="text-md font-semibold mb-3">Histórico de Erros</h3>
            
            {errors.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                {isLoading ? 'Carregando erros...' : 'Nenhum erro registrado'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Últimos 10 erros registrados</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Data</TableHead>
                      <TableHead className="w-[150px]">Tipo</TableHead>
                      <TableHead>Mensagem</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {errors.map((error) => (
                      <TableRow key={error.id}>
                        <TableCell>{formatDate(error.occurred_at)}</TableCell>
                        <TableCell>{error.error_type}</TableCell>
                        <TableCell className="font-mono text-xs">{error.error_message}</TableCell>
                        <TableCell>
                          {error.resolved ? (
                            <span className="text-green-500">Resolvido</span>
                          ) : (
                            <span className="text-red-500">Aberto</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          variant="outline" 
          className="border-veloz-gray text-white"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Informações
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WhatsAppMetrics;
