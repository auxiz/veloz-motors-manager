
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@marsidev/react-turnstile';

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
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  
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
          <div className="flex justify-center">
            <Turnstile
              siteKey="1x00000000000000000000AA" // Replace with your actual site key
              onSuccess={(token) => setCaptchaToken(token)}
              options={{
                theme: 'dark',
              }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
            disabled={loading || !captchaToken}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
