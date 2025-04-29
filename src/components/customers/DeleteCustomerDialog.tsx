
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCustomers } from '@/hooks/useCustomers';

interface DeleteCustomerDialogProps {
  customerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteCustomerDialog: React.FC<DeleteCustomerDialogProps> = ({
  customerId,
  isOpen,
  onClose
}) => {
  const { customers, deleteCustomer } = useCustomers();
  
  const customer = customers.find(c => c.id === customerId);
  
  if (!customer) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await deleteCustomer.mutateAsync(customerId);
      onClose();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-veloz-black text-veloz-white border-veloz-gray">
        <DialogHeader>
          <DialogTitle className="text-2xl">Excluir Cliente</DialogTitle>
          <DialogDescription className="text-veloz-gray-lighter">
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <p>
            Você tem certeza que deseja excluir o cliente <span className="font-bold">{customer.name}</span>?
          </p>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCustomer.isPending}
            >
              {deleteCustomer.isPending ? 'Excluindo...' : 'Excluir Cliente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
