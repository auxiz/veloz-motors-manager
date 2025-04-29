
import React, { useState, useEffect } from 'react';
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
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useProfiles } from '@/hooks/useProfiles';
import { CreateUserDialog } from './dialogs/CreateUserDialog';
import { toast } from 'sonner';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

const UserManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deactivateUserId, setDeactivateUserId] = useState<string | null>(null);
  const { users, loading: usersLoading } = useUsers();
  const { 
    profiles, 
    fetchAllProfiles, 
    deactivateUser, 
    loading: profilesLoading 
  } = useProfiles();
  
  useEffect(() => {
    fetchAllProfiles();
  }, []);

  const handleDeactivateUser = async () => {
    if (deactivateUserId) {
      await deactivateUser(deactivateUserId);
      setDeactivateUserId(null);
    }
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

  const loading = usersLoading || profilesLoading;

  return (
    <>
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
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
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
                            onClick={() => setDeactivateUserId(user.id)}
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
          )}
        </CardContent>
      </Card>

      <CreateUserDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onUserCreated={fetchAllProfiles}
      />

      <AlertDialog open={!!deactivateUserId} onOpenChange={() => setDeactivateUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Desativar Usuário
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá desativar o acesso do usuário ao sistema. 
              O usuário não poderá mais fazer login, mas seus dados serão mantidos.
              Você tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeactivateUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Sim, desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserManagement;
