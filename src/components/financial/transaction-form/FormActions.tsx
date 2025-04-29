
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

export function FormActions({ onCancel, isEditing }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button 
        type="submit"
        className="bg-veloz-yellow hover:bg-yellow-500 text-black"
      >
        {isEditing ? 'Salvar Alterações' : 'Adicionar Transação'}
      </Button>
    </div>
  );
}
