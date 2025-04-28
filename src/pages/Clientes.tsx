
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CustomersFilter } from '@/components/customers/CustomersFilter';
import { CustomersList } from '@/components/customers/CustomersList';
import { AddCustomerDialog } from '@/components/customers/AddCustomerDialog';

const Clientes = () => {
  const [filters, setFilters] = useState({
    search: '',
    segment: 'all',
    status: 'all'
  });

  const handleFilterChange = (newFilters: {
    search: string;
    segment: string;
    status: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Clientes</h1>
          <p className="text-muted-foreground">Gerencie informações de clientes e histórico de compras</p>
        </div>
        <AddCustomerDialog />
      </div>

      <Card className="bg-veloz-black border-veloz-gray">
        <CardContent className="p-6">
          <CustomersFilter onFilterChange={handleFilterChange} />
        </CardContent>
      </Card>

      <CustomersList filters={filters} />
    </div>
  );
};

export default Clientes;
