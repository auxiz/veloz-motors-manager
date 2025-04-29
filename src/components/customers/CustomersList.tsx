
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, FileText, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/hooks/useCustomers';
import { CustomerDetailsDialog } from './CustomerDetailsDialog';
import { EditCustomerDialog } from './EditCustomerDialog';
import { DeleteCustomerDialog } from './DeleteCustomerDialog';
import { CUSTOMER_SEGMENTS } from '@/types/customer';

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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Filter customers based on filters
  const filteredCustomers = customers.filter(customer => {
    // Search filter
    if (filters.search && !customer.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !customer.document.includes(filters.search) &&
        !(customer.email && customer.email.toLowerCase().includes(filters.search.toLowerCase()))) {
      return false;
    }
    
    // Segment filter
    if (filters.segment !== 'all') {
      // Check if customer has the selected segment in tags
      return customer.tags?.includes(filters.segment) ?? false;
    }
    
    // Status filter
    if (filters.status !== 'all' && customer.status !== filters.status) {
      return false;
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

  const handleDelete = (customerId: string) => {
    setSelectedCustomer(customerId);
    setIsDeleteOpen(true);
  };

  const getCustomerSegmentBadges = (customer: any) => {
    if (!customer.tags || customer.tags.length === 0) {
      return <Badge variant="outline" className="bg-veloz-black">Novo Cliente</Badge>;
    }
    
    return customer.tags.map((tag: string) => {
      const segment = CUSTOMER_SEGMENTS.find(s => s.id === tag);
      if (!segment) return null;
      
      // Use different colors for different segment types
      let badgeClass = "bg-veloz-black";
      if (segment.type === 'behavior') badgeClass = "bg-blue-700";
      if (segment.type === 'preference') badgeClass = "bg-purple-700";
      if (segment.type === 'status') badgeClass = "bg-green-700";
      
      return (
        <Badge key={tag} variant="outline" className={badgeClass}>
          {segment.label}
        </Badge>
      );
    });
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
                  <div className="flex flex-wrap gap-1">
                    {getCustomerSegmentBadges(customer)}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge className={
                    customer.status === 'active' ? 'bg-green-700 text-white' : 
                    customer.status === 'lead' ? 'bg-blue-700 text-white' : 
                    'bg-gray-700 text-white'
                  }>
                    {customer.status === 'active' ? 'Ativo' : 
                     customer.status === 'lead' ? 'Lead' : 
                     customer.status === 'inactive' ? 'Inativo' : 'Desconhecido'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    onClick={() => handleViewDetails(customer.id)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 sm:w-auto sm:px-2"
                  >
                    <Eye size={16} className="sm:mr-1" />
                    <span className="hidden sm:inline">Detalhes</span>
                  </Button>
                  <Button
                    onClick={() => handleEdit(customer.id)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 sm:w-auto sm:px-2"
                  >
                    <Edit size={16} className="sm:mr-1" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                  <Button
                    onClick={() => handleDelete(customer.id)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 sm:w-auto sm:px-2 border-red-800 hover:bg-red-900"
                  >
                    <Trash2 size={16} className="sm:mr-1 text-red-500" />
                    <span className="hidden sm:inline text-red-500">Excluir</span>
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
          <DeleteCustomerDialog
            customerId={selectedCustomer}
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
          />
        </>
      )}
    </div>
  );
};
