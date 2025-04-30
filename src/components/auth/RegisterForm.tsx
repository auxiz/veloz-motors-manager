
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, LockKeyhole, User } from 'lucide-react';

interface RegisterFormProps {
  registerForm: { name: string; email: string; password: string };
  handleRegisterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRegisterSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  registerForm,
  handleRegisterChange,
  handleRegisterSubmit,
  loading,
}) => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <form onSubmit={handleRegisterSubmit}>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                id="name" 
                type="text"
                placeholder="Seu nome completo" 
                required 
                className="bg-veloz-gray/50 border-gray-700 text-white pl-10 focus-visible:ring-veloz-yellow"
                value={registerForm.name}
                onChange={handleRegisterChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com"
                required
                className="bg-veloz-gray/50 border-gray-700 text-white pl-10 focus-visible:ring-veloz-yellow"
                value={registerForm.email}
                onChange={handleRegisterChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Senha</Label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••" 
                required 
                className="bg-veloz-gray/50 border-gray-700 text-white pl-10 focus-visible:ring-veloz-yellow"
                value={registerForm.password}
                onChange={handleRegisterChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-0">
          <Button 
            type="submit" 
            className="w-full bg-veloz-yellow hover:bg-amber-500 text-veloz-black font-semibold py-5"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Criar Conta'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
