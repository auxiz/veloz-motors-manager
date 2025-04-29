
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader 
} from '@/components/ui/card';
import { useUsers } from '@/hooks/useUsers';
import { useProfiles } from '@/hooks/useProfiles';
import { CreateUserDialog } from './dialogs/CreateUserDialog';
import UserManagementHeader from './user-management/UserManagementHeader';
import UserTable from './user-management/UserTable';
import DeactivateUserDialog from './user-management/DeactivateUserDialog';

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

  const loading = usersLoading || profilesLoading;

  return (
    <>
      <Card>
        <CardHeader>
          <UserManagementHeader onCreateUser={() => setIsCreateDialogOpen(true)} />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <UserTable 
              users={users} 
              onDeactivateUser={setDeactivateUserId} 
            />
          )}
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
    </>
  );
};

export default UserManagement;
