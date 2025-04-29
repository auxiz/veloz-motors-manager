
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateUserForm } from './user-form/CreateUserForm';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: () => void;
}

export function CreateUserDialog({ open, onOpenChange, onUserCreated }: CreateUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para convidar um novo usuário para o sistema.
          </DialogDescription>
        </DialogHeader>
        
        <CreateUserForm 
          onClose={() => onOpenChange(false)} 
          onUserCreated={onUserCreated}
        />
      </DialogContent>
    </Dialog>
  );
}
