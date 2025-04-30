
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LockKeyhole, Mail } from 'lucide-react';

interface LoginFormProps {
  loginForm: { email: string; password: string };
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginSubmit: (e: React.FormEvent) => Promise<void>;
  toggleForgotPassword: (e: React.MouseEvent) => void;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginForm,
  handleLoginChange,
  handleLoginSubmit,
  toggleForgotPassword,
  loading,
}) => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <form onSubmit={handleLoginSubmit}>
        <CardContent className="space-y-6 pt-4">
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
                value={loginForm.email}
                onChange={handleLoginChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white">Senha</Label>
              <a 
                href="#" 
                className="text-sm text-veloz-yellow hover:text-yellow-400 transition-colors"
                onClick={toggleForgotPassword}
              >
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••" 
                required 
                className="bg-veloz-gray/50 border-gray-700 text-white pl-10 focus-visible:ring-veloz-yellow"
                value={loginForm.password}
                onChange={handleLoginChange}
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
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
