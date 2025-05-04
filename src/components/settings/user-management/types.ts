
import { AuthUser } from '@/types/auth';
import { UserData } from '@/hooks/useUserData';

export interface UserManagementProps {
  onUserUpdated?: () => void;
}

export interface UserTableProps {
  users: UserData[];
  onDeactivateUser: (userId: string) => void;
  onEditUser?: (user: UserData) => void;
}

export interface PendingUsersListProps {
  pendingUsers: AuthUser[];
  onApprove: (user: AuthUser) => void;
  onReject: (user: AuthUser) => void;
  onSetRole: (user: AuthUser) => void;
}

export interface SetUserRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  onSubmit: (userId: string, role: string) => Promise<void>;
}
