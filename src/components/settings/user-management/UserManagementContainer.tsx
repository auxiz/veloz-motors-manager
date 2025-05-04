
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUsers } from '@/hooks/useUsers';
import { useProfiles } from '@/hooks/useProfiles';
import { CreateUserDialog } from '../dialogs/CreateUserDialog';
import UserManagementHeader from './UserManagementHeader';
import ActiveUsersTab from './tabs/ActiveUsersTab';
import PendingUsersTab from './tabs/PendingUsersTab';
import { AuthUser } from '@/types/auth';
import { UserData } from '@/hooks/useUserData';
import DeactivateUserDialog from './DeactivateUserDialog';
import { SetUserRoleDialog } from './SetUserRoleDialog';

const UserManagementContainer = () => {
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
      fetchAllProfiles();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (user: AuthUser) => {
    try {
      await updateUserStatus(user.id, 'rejected');
      fetchAllProfiles();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleSetRole = (user: AuthUser) => {
    setSelectedUser(user);
    setIsSetRoleDialogOpen(true);
  };

  const handleSubmitRole = async (userId: string, role: string) => {
    try {
      await updateUserRole(userId, role);
      fetchAllProfiles();
    } catch (error) {
      console.error('Error updating role:', error);
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
              <ActiveUsersTab 
                users={activeUsers}
                loading={loading}
                onDeactivateUser={setDeactivateUserId}
              />
            </TabsContent>

            <TabsContent value="pending" className="w-full">
              <PendingUsersTab
                pendingUsers={pendingUsers}
                loading={loading}
                onApprove={handleApproveUser}
                onReject={handleRejectUser}
                onSetRole={handleSetRole}
              />
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

export default UserManagementContainer;
