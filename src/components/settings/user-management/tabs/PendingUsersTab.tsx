
import React from 'react';
import { CardDescription } from '@/components/ui/card';
import { AuthUser } from '@/types/auth';
import { PendingUsersList } from '../PendingUsersList';

interface PendingUsersTabProps {
  pendingUsers: AuthUser[];
  loading: boolean;
  onApprove: (user: AuthUser) => void;
  onReject: (user: AuthUser) => void;
  onSetRole: (user: AuthUser) => void;
}

const PendingUsersTab: React.FC<PendingUsersTabProps> = ({ 
  pendingUsers, 
  loading, 
  onApprove, 
  onReject, 
  onSetRole 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <>
      <CardDescription className="mb-4">
        Novos usuários aguardando aprovação. Defina a função e aprove ou rejeite o acesso.
      </CardDescription>
      <PendingUsersList 
        pendingUsers={pendingUsers}
        onApprove={onApprove}
        onReject={onReject}
        onSetRole={onSetRole}
      />
    </>
  );
};

export default PendingUsersTab;
