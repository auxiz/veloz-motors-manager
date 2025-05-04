
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useProfiles } from '@/hooks/useProfiles';
import { NameField } from './fields/NameField';
import { EmailField } from './fields/EmailField'; 
import { RoleField } from './fields/RoleField';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  role: z.enum(['administrator', 'seller', 'financial', 'dispatcher', 'investor']),
});

export type UserFormValues = z.infer<typeof formSchema>;

interface CreateUserFormProps {
  onClose: () => void;
  onUserCreated?: () => void;
}

export function CreateUserForm({ onClose, onUserCreated }: CreateUserFormProps) {
  const { inviteUser } = useProfiles();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      role: 'seller',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      const result = await inviteUser(data.email, data.name, data.role);
      
      if (result.success) {
        form.reset();
        onClose();
        if (onUserCreated) {
          onUserCreated();
        }
      }
    } catch (error: any) {
      toast.error("Erro ao enviar convite", {
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <NameField control={form.control} />
        <EmailField control={form.control} />
        <RoleField control={form.control} />

        <DialogFooter>
          <Button type="submit">Convidar Usuário</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
