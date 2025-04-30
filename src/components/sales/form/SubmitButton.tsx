
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <div className="flex justify-end">
      <Button 
        type="submit" 
        className="bg-veloz-yellow hover:bg-yellow-500 text-black font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registrando...' : 'Registrar Venda'}
      </Button>
    </div>
  );
};
