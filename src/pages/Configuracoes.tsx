
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import UserManagement from '@/components/settings/UserManagement';
import ProfileSettings from '@/components/settings/ProfileSettings';
import SystemPreferences from '@/components/settings/SystemPreferences';
import { useUsers } from '@/hooks/useUsers';

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState<string>("users");
  const { user } = useUsers();
  
  // Only admins should have access to user management and system preferences
  const isAdmin = user?.profile?.role === 'administrator';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">Personalize o sistema e gerencie usuários</p>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          {isAdmin && <TabsTrigger value="users">Usuários</TabsTrigger>}
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          {isAdmin && <TabsTrigger value="system">Sistema</TabsTrigger>}
        </TabsList>

        {isAdmin && (
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>
        )}
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="system" className="space-y-4">
            <SystemPreferences />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Configuracoes;
