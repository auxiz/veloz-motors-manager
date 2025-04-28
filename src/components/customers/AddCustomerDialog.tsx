
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NewCustomerForm } from './NewCustomerForm';

interface AddCustomerDialogProps {
  onCustomerCreated?: (customerId: string) => void;
  triggerClassName?: string;
}

export const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({ 
  onCustomerCreated,
  triggerClassName 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCustomerCreated = (customerId: string) => {
    if (onCustomerCreated) {
      onCustomerCreated(customerId);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-veloz-yellow hover:bg-yellow-500 text-black ${triggerClassName}`}>
          <Plus size={16} className="mr-2" /> Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-veloz-black text-veloz-white border-veloz-gray max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Cadastrar Novo Cliente</DialogTitle>
        </DialogHeader>
        
        <NewCustomerForm 
          onCustomerCreated={handleCustomerCreated}
          embedded={true}
        />
      </DialogContent>
    </Dialog>
  );
};
