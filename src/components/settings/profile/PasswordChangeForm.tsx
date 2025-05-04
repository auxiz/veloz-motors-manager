
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const PasswordChangeForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    // This would use Supabase Auth to update the password in a real app
    toast.success('Senha atualizada com sucesso');
    
    // Reset password fields
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <form onSubmit={handlePasswordUpdate} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Senha Atual</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nova Senha</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="pt-2 flex justify-end">
        <Button type="submit">
          Atualizar Senha
        </Button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;
