
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@marsidev/react-turnstile';

interface ForgotPasswordFormProps {
  resetForm: { email: string };
  handleResetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetSubmit: (e: React.FormEvent) => Promise<void>;
  toggleForgotPassword: (e: React.MouseEvent) => void;
  loading: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  resetForm,
  handleResetChange,
  handleResetSubmit,
  toggleForgotPassword,
  loading,
}) => {
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  
  return (
    <Card className="border-veloz-gray bg-veloz-gray">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-veloz-white">
          Recuperar Senha
        </h2>
      </CardHeader>
      <form onSubmit={handleResetSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="seu@email.com"
              required
              className="bg-veloz-black border-veloz-gray text-veloz-white"
              value={resetForm.email}
              onChange={handleResetChange}
            />
          </div>
          <p className="text-sm text-gray-400">
            Informe seu email e enviaremos instruções para redefinir sua senha.
          </p>
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
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="w-full bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
            disabled={loading || !captchaToken}
          >
            {loading ? 'Enviando...' : 'Enviar instruções'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-veloz-white"
            onClick={toggleForgotPassword}
          >
            Voltar ao login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;
