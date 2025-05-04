
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Image } from 'lucide-react';
import { useProfiles } from '@/hooks/useProfiles';
import { AuthUser } from '@/types/auth';

interface ProfileAvatarProps {
  user?: AuthUser | null;
}

const ProfileAvatar = ({ user }: ProfileAvatarProps) => {
  const { uploadAvatar } = useProfiles();
  const [isUploading, setIsUploading] = useState(false);

  const getInitials = () => {
    const firstName = user?.profile?.first_name || '';
    const lastName = user?.profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('O arquivo é muito grande. Tamanho máximo: 5MB');
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas arquivos de imagem são permitidos');
      }
      
      await uploadAvatar(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mb-8 md:mb-0">
      <Avatar className="h-32 w-32">
        {user?.profile?.avatar_url ? (
          <AvatarImage src={user.profile.avatar_url} />
        ) : (
          <AvatarFallback className="bg-veloz-black text-veloz-yellow text-4xl">
            {getInitials()}
          </AvatarFallback>
        )}
      </Avatar>
      <Button variant="outline" disabled={isUploading} asChild>
        <label className="flex items-center cursor-pointer">
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Image className="h-4 w-4 mr-2" />
          )}
          Alterar Foto
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isUploading}
          />
        </label>
      </Button>
    </div>
  );
};

export default ProfileAvatar;
