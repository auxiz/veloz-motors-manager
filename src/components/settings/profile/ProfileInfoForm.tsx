
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Save, Loader2 } from 'lucide-react';
import { useProfiles } from '@/hooks/useProfiles';
import { AuthUser } from '@/types/auth';

interface ProfileInfoFormProps {
  user?: AuthUser | null;
}

const ProfileInfoForm = ({ user }: ProfileInfoFormProps) => {
  const { updateProfile } = useProfiles();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.profile?.first_name || '',
    lastName: user?.profile?.last_name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData(prev => ({
        ...prev,
        firstName: user.profile?.first_name || '',
        lastName: user.profile?.last_name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    try {
      setIsUpdating(true);
      
      await updateProfile(user.id, {
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleProfileUpdate} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input
            id="firstName"
            name="firstName"
            disabled={!isEditing || isUpdating}
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input
            id="lastName"
            name="lastName"
            disabled={!isEditing || isUpdating}
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          disabled
          value={formData.email}
        />
      </div>
      
      <div className="pt-2 flex justify-end">
        {isEditing ? (
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProfileInfoForm;
