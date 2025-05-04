
import React from 'react';
import UserTable from '../UserTable';
import { UserData } from '@/hooks/useUserData';

interface ActiveUsersTabProps {
  users: UserData[];
  loading: boolean;
  onDeactivateUser: (userId: string) => void;
}

const ActiveUsersTab: React.FC<ActiveUsersTabProps> = ({ users, loading, onDeactivateUser }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <UserTable users={users} onDeactivateUser={onDeactivateUser} />;
};

export default ActiveUsersTab;
