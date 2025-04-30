
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface PlateSearchButtonProps {
  onClick: () => void;
}

export const PlateSearchButton: React.FC<PlateSearchButtonProps> = ({ onClick }) => {
  return (
    <Button 
      type="button" 
      variant="outline" 
      onClick={onClick}
      className="border-veloz-yellow text-veloz-yellow hover:bg-veloz-yellow hover:text-veloz-black"
    >
      <Search className="mr-2" size={16} />
      Buscar por Placa
    </Button>
  );
};
