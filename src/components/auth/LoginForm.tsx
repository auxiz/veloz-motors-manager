
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
    <Card className="border-veloz-gray bg-veloz-gray">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-veloz-white">
          Acesse sua conta
        </h2>
      </CardHeader>
      <form onSubmit={handleLoginSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="seu@email.com"
              required
              className="bg-veloz-black border-veloz-gray text-veloz-white"
              value={loginForm.email}
              onChange={handleLoginChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <a 
                href="#" 
                className="text-sm text-veloz-yellow hover:underline"
                onClick={toggleForgotPassword}
              >
                Esqueceu a senha?
              </a>
            </div>
            <Input 
              id="password" 
              type="password"
              placeholder="••••••••" 
              required 
              className="bg-veloz-black border-veloz-gray text-veloz-white"
              value={loginForm.password}
              onChange={handleLoginChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
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
