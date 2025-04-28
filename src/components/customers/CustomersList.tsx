
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, FileText, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/hooks/useCustomers';
import { CustomerDetailsDialog } from './CustomerDetailsDialog';
import { EditCustomerDialog } from './EditCustomerDialog';

interface CustomersListProps {
  filters: {
    search: string;
    segment: string;
    status: string;
  };
}

export const CustomersList: React.FC<CustomersListProps> = ({ filters }) => {
  const { customers, isLoading } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Filter customers based on filters
  const filteredCustomers = customers.filter(customer => {
    // Search filter
    if (filters.search && !customer.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !customer.document.includes(filters.search) &&
        !(customer.email && customer.email.toLowerCase().includes(filters.search.toLowerCase()))) {
      return false;
    }
    
    // Segment filter - in a real app, this would filter based on tags stored in DB
    if (filters.segment !== 'all') {
      // This is placeholder logic - in real implementation, we'd check tags from the database
      return false; // Currently no segment data available
    }
    
    // Status filter - in a real app, this would filter based on status stored in DB
    if (filters.status !== 'all') {
      // This is placeholder logic - in real implementation, we'd check status from the database
      return false; // Currently no status data available
    }
    
    return true;
  });

  const handleViewDetails = (customerId: string) => {
    setSelectedCustomer(customerId);
    setIsDetailsOpen(true);
  };

  const handleEdit = (customerId: string) => {
    setSelectedCustomer(customerId);
    setIsEditOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center my-8">Carregando clientes...</div>;
  }

  return (
    <div className="bg-veloz-gray rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-veloz-gray">
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Documento</TableHead>
            <TableHead className="hidden md:table-cell">Contato</TableHead>
            <TableHead className="hidden lg:table-cell">Segmento</TableHead>
            <TableHead className="hidden lg:table-cell">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Nenhum cliente encontrado com os filtros aplicados.
              </TableCell>
            </TableRow>
          ) : (
            filteredCustomers.map((customer) => (
              <TableRow key={customer.id} className="border-b border-veloz-gray hover:bg-veloz-black">
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="hidden md:table-cell">{customer.document}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {customer.email ? customer.email : '-'}<br />
                  {customer.phone ? customer.phone : '-'}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline" className="bg-veloz-black">Novo Cliente</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge className="bg-green-700 text-white">Ativo</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    onClick={() => handleViewDetails(customer.id)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3"
                  >
                    <Eye size={16} className="sm:mr-2" />
                    <span className="hidden sm:inline">Detalhes</span>
                  </Button>
                  <Button
                    onClick={() => handleEdit(customer.id)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3"
                  >
                    <Edit size={16} className="sm:mr-2" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {selectedCustomer && (
        <>
          <CustomerDetailsDialog
            customerId={selectedCustomer}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
          />
          <EditCustomerDialog
            customerId={selectedCustomer}
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
          />
        </>
      )}
    </div>
  );
};
