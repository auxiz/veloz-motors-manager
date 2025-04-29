
import React from 'react';
import { 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';

interface UserManagementHeaderProps {
  onCreateUser: () => void;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ onCreateUser }) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-2xl flex items-center">
          <Users className="mr-2 h-6 w-6 text-veloz-yellow" />
          Gerenciamento de Usuários
        </CardTitle>
        <CardDescription>
          Gerencie os usuários do sistema e suas permissões
        </CardDescription>
      </div>
      <Button onClick={onCreateUser}>
        <UserPlus className="h-4 w-4 mr-2" />
        Novo Usuário
      </Button>
    </div>
  );
};

export default UserManagementHeader;
