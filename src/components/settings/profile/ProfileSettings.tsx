
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import ProfileTabs from './ProfileTabs';
import { useUsers } from '@/hooks/useUsers';
import { AuthUser } from '@/types/auth';

const ProfileSettings = () => {
  const { user } = useUsers();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <User className="mr-2 h-6 w-6 text-veloz-yellow" />
          Configurações de Perfil
        </CardTitle>
        <CardDescription>
          Atualize suas informações pessoais e credenciais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <ProfileAvatar user={user} />
          <ProfileTabs user={user} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
