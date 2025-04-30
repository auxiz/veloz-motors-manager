
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting: boolean;
  label?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isSubmitting,
  label = 'Salvar Cliente' 
}) => {
  return (
    <div className="flex justify-end pt-4">
      <Button 
        type="submit" 
        className="bg-veloz-yellow hover:bg-yellow-500 text-black font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : label}
      </Button>
    </div>
  );
};
