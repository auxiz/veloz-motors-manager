
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { AuthUser } from '@/types/auth';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const formSchema = z.object({
  role: z.enum(['administrator', 'seller', 'financial', 'dispatcher', 'investor']),
});

type FormValues = z.infer<typeof formSchema>;

interface SetUserRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  onSubmit: (userId: string, role: string) => Promise<void>;
}

export function SetUserRoleDialog({ isOpen, onClose, user, onSubmit }: SetUserRoleDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'seller',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    if (!user) return;
    
    await onSubmit(user.id, data.role);
    form.reset();
    onClose();
  };
  
  const userName = user ? `${user.profile?.first_name || ''} ${user.profile?.last_name || ''}`.trim() : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Definir Função do Usuário</DialogTitle>
          <DialogDescription>
            Escolha a função para {userName || user?.email}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrator">Administrador - Acesso total</SelectItem>
                        <SelectItem value="seller">Vendedor - Gestão de vendas</SelectItem>
                        <SelectItem value="financial">Financeiro - Gestão financeira</SelectItem>
                        <SelectItem value="dispatcher">Despachante - Documentação</SelectItem>
                        <SelectItem value="investor">Investidor - Visualização de investimentos</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
