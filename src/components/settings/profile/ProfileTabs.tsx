
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfileInfoForm from './ProfileInfoForm';
import PasswordChangeForm from './PasswordChangeForm';
import { AuthUser } from '@/types/auth';

interface ProfileTabsProps {
  user?: AuthUser | null;
}

const ProfileTabs = ({ user }: ProfileTabsProps) => {
  return (
    <div className="flex-1 w-full">
      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="password">Alterar Senha</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 mt-4">
          <ProfileInfoForm user={user} />
        </TabsContent>
        
        <TabsContent value="password" className="space-y-4 mt-4">
          <PasswordChangeForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
