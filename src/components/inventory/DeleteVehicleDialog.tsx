
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

interface DeleteVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  vehicleName: string;
}

export const DeleteVehicleDialog = ({
  open,
  onOpenChange,
  onConfirm,
  vehicleName
}: DeleteVehicleDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-veloz-black border-veloz-gray">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-veloz-white">
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir {vehicleName}? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-veloz-gray text-veloz-white border-veloz-gray">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
