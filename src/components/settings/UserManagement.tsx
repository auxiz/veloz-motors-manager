
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUsers } from '@/hooks/useUsers';
import { useProfiles } from '@/hooks/useProfiles';
import { CreateUserDialog } from './dialogs/CreateUserDialog';
import UserManagementHeader from './user-management/UserManagementHeader';
import UserTable from './user-management/UserTable';
import DeactivateUserDialog from './user-management/DeactivateUserDialog';
import { PendingUsersList } from './user-management/PendingUsersList';
import { SetUserRoleDialog } from './user-management/SetUserRoleDialog';
import { AuthUser } from '@/types/auth';
import { toast } from 'sonner';
import { UserData } from '@/hooks/useUserData';

const UserManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deactivateUserId, setDeactivateUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [isSetRoleDialogOpen, setIsSetRoleDialogOpen] = useState(false);

  const { users, loading: usersLoading } = useUsers();
  const { 
    profiles, 
    fetchAllProfiles, 
    deactivateUser, 
    updateUserStatus,
    updateUserRole,
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

  // Convert UserData[] to AuthUser[] for compatibility with PendingUsersList
  const convertToAuthUsers = (users: UserData[]): AuthUser[] => {
    return users.map(user => {
      // Create a minimal AuthUser object with the required properties
      return {
        id: user.id,
        email: user.email,
        profile: user.profile,
        // Add minimal required properties from SupabaseUser
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: user.profile?.created_at || new Date().toISOString()
      } as AuthUser;
    });
  };

  const pendingUsers = convertToAuthUsers(
    users.filter(user => user.profile?.status === 'pending')
  );

  const activeUsers = users.filter(user => 
    user.profile?.status === 'approved'
  );

  const handleApproveUser = async (user: AuthUser) => {
    try {
      await updateUserStatus(user.id, 'approved');
      toast.success('Usuário aprovado com sucesso');
      fetchAllProfiles();
    } catch (error) {
      toast.error('Erro ao aprovar usuário');
    }
  };

  const handleRejectUser = async (user: AuthUser) => {
    try {
      await updateUserStatus(user.id, 'rejected');
      toast.success('Usuário rejeitado');
      fetchAllProfiles();
    } catch (error) {
      toast.error('Erro ao rejeitar usuário');
    }
  };

  const handleSetRole = (user: AuthUser) => {
    setSelectedUser(user);
    setIsSetRoleDialogOpen(true);
  };

  const handleSubmitRole = async (userId: string, role: string) => {
    try {
      await updateUserRole(userId, role);
      toast.success('Função atualizada com sucesso');
      fetchAllProfiles();
    } catch (error) {
      toast.error('Erro ao atualizar função');
    }
  };

  const loading = usersLoading || profilesLoading;

  return (
    <>
      <Card>
        <CardHeader>
          <UserManagementHeader onCreateUser={() => setIsCreateDialogOpen(true)} />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="active">
                Usuários Ativos
              </TabsTrigger>
              <TabsTrigger value="pending">
                Aguardando Aprovação
                {pendingUsers.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary w-5 h-5 flex items-center justify-center text-xs text-primary-foreground">
                    {pendingUsers.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="w-full">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <UserTable 
                  users={activeUsers} 
                  onDeactivateUser={setDeactivateUserId} 
                />
              )}
            </TabsContent>

            <TabsContent value="pending" className="w-full">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <CardDescription className="mb-4">
                    Novos usuários aguardando aprovação. Defina a função e aprove ou rejeite o acesso.
                  </CardDescription>
                  <PendingUsersList 
                    pendingUsers={pendingUsers}
                    onApprove={handleApproveUser}
                    onReject={handleRejectUser}
                    onSetRole={handleSetRole}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateUserDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onUserCreated={fetchAllProfiles}
      />

      <DeactivateUserDialog 
        isOpen={!!deactivateUserId}
        onClose={() => setDeactivateUserId(null)}
        onConfirm={handleDeactivateUser}
      />

      <SetUserRoleDialog
        isOpen={isSetRoleDialogOpen}
        onClose={() => {
          setIsSetRoleDialogOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleSubmitRole}
      />
    </>
  );
};

export default UserManagement;
