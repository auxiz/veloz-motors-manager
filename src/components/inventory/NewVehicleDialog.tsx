
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NewVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewVehicleDialog = ({ open, onOpenChange }: NewVehicleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-veloz-gray border-veloz-gray max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Novo Veículo</DialogTitle>
          <DialogDescription>
            Preencha os dados do veículo para adicioná-lo ao estoque.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <p className="col-span-1 md:col-span-2 text-center text-muted-foreground">
            O formulário completo será implementado em uma próxima etapa com integração ao Supabase.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" className="border-veloz-gray text-veloz-white" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-veloz-yellow text-veloz-black hover:bg-opacity-90">
            Salvar Veículo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
