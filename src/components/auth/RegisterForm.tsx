
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  return (
    <Card className="border-veloz-gray bg-veloz-gray">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-veloz-white">Criar nova conta</h2>
      </CardHeader>
      <form onSubmit={handleRegisterSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input 
              id="name" 
              type="text"
              placeholder="Seu nome completo" 
              required 
              className="bg-veloz-black border-veloz-gray text-veloz-white"
              value={registerForm.name}
              onChange={handleRegisterChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="seu@email.com"
              required
              className="bg-veloz-black border-veloz-gray text-veloz-white"
              value={registerForm.email}
              onChange={handleRegisterChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              type="password"
              placeholder="••••••••" 
              required 
              className="bg-veloz-black border-veloz-gray text-veloz-white"
              value={registerForm.password}
              onChange={handleRegisterChange}
            />
          </div>
          
          {/* Simple CAPTCHA replacement */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="captcha-register" 
              checked={captchaVerified}
              onCheckedChange={(checked) => {
                setCaptchaVerified(checked === true);
              }}
            />
            <label
              htmlFor="captcha-register"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-veloz-white"
            >
              Não sou um robô
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
            disabled={loading || !captchaVerified}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
