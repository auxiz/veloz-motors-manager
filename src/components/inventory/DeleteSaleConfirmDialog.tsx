
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteSaleConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDeleteSale: () => void;
  onKeepSale: () => void;
  vehicleName: string;
}

export const DeleteSaleConfirmDialog = ({
  open,
  onOpenChange,
  onConfirmDeleteSale,
  onKeepSale,
  vehicleName
}: DeleteSaleConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-veloz-gray border-veloz-gray text-veloz-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Venda?</AlertDialogTitle>
          <AlertDialogDescription className="text-veloz-white/70">
            Este veículo ({vehicleName}) está marcado como vendido. Deseja excluir o registro de venda ao 
            alterar o status para "Em estoque"?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-veloz-gray border border-veloz-yellow text-veloz-yellow hover:bg-veloz-yellow/20"
            onClick={onKeepSale}
          >
            Não, apenas mudar o status
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirmDeleteSale}
          >
            Sim, excluir venda
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
