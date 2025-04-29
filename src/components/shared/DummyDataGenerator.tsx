
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Wrench } from 'lucide-react';

interface DummyDataGeneratorProps {
  type: 'vehicle' | 'customer' | 'transaction' | 'sale';
  buttonClassName?: string;
}

export function DummyDataGenerator({ type, buttonClassName }: DummyDataGeneratorProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const generateDummyData = async () => {
    setIsLoading(true);
    try {
      let message = '';
      let functionName: "generate_dummy_vehicle" | "generate_dummy_customer" | "generate_dummy_transaction" | "generate_dummy_sale";
      
      switch (type) {
        case 'vehicle':
          functionName = "generate_dummy_vehicle";
          message = 'Veículo gerado com sucesso!';
          break;
        case 'customer':
          functionName = "generate_dummy_customer";
          message = 'Cliente gerado com sucesso!';
          break;
        case 'transaction':
          functionName = "generate_dummy_transaction";
          message = 'Transação gerada com sucesso!';
          break;
        case 'sale':
          functionName = "generate_dummy_sale";
          message = 'Venda gerada com sucesso!';
          break;
      }

      const { data, error } = await supabase.rpc(functionName);
      
      if (error) throw error;
      
      toast.success(message);
      return data;
    } catch (error) {
      console.error(`Error generating dummy ${type}:`, error);
      toast.error(`Erro ao gerar ${type === 'vehicle' ? 'veículo' : 
                                   type === 'customer' ? 'cliente' : 
                                   type === 'transaction' ? 'transação' : 'venda'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={buttonClassName || ""}
        >
          <Wrench className="h-4 w-4 mr-1" />
          Gerar Dados
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-2">
          <h4 className="font-medium">Gerar Dados de Teste</h4>
          <p className="text-sm text-muted-foreground">
            Gerar um {type === 'vehicle' ? 'veículo' : 
                      type === 'customer' ? 'cliente' : 
                      type === 'transaction' ? 'transação' : 'venda'} aleatório para testes.
          </p>
          <Button 
            onClick={generateDummyData} 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? 'Gerando...' : 'Gerar Agora'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
