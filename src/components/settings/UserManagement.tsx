
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  UserMinus, 
  User, 
  Users,
  MoreHorizontal 
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { CreateUserDialog } from './dialogs/CreateUserDialog';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';

const UserManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { users } = useUsers();
  const { toast } = useToast();
  
  const handleDeactivateUser = (userId: string) => {
    toast({
      title: "Usuário desativado",
      description: "O usuário foi desativado com sucesso.",
    });
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'administrator':
        return 'bg-red-500 hover:bg-red-600';
      case 'seller':
        return 'bg-green-500 hover:bg-green-600';
      case 'financial':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl flex items-center">
            <Users className="mr-2 h-6 w-6 text-veloz-yellow" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            Gerencie os usuários do sistema e suas permissões
          </CardDescription>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.profile?.role && (
                    <Badge className={getRoleBadgeColor(user.profile?.role)}>
                      {user.profile?.role === 'administrator' && 'Administrador'}
                      {user.profile?.role === 'seller' && 'Vendedor'}
                      {user.profile?.role === 'financial' && 'Financeiro'}
                      {!['administrator', 'seller', 'financial'].includes(user.profile?.role) && user.profile?.role}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-500">
                    Ativo
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar usuário</DropdownMenuItem>
                      <DropdownMenuItem>Alterar função</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeactivateUser(user.id)}
                      >
                        Desativar usuário
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CreateUserDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </Card>
  );
};

export default UserManagement;
