
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface LeadsHeaderProps {
  leadsCount: number;
  isLoading: boolean;
  fetchLeads: () => void;
}

export const LeadsHeader: React.FC<LeadsHeaderProps> = ({
  leadsCount,
  isLoading,
  fetchLeads
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg text-white">Leads</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchLeads} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      <CardDescription className="text-gray-400">
        {leadsCount} leads encontrados
      </CardDescription>
    </>
  );
};
