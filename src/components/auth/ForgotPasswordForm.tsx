
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';

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
  return (
    <Card className="border-none shadow-none bg-transparent">
      <form onSubmit={handleResetSubmit}>
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
                value={resetForm.email}
                onChange={handleResetChange}
              />
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Informe seu email e enviaremos instruções para redefinir sua senha.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-2 pb-0">
          <Button 
            type="submit" 
            className="w-full bg-veloz-yellow hover:bg-amber-500 text-veloz-black font-semibold py-5"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar instruções'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-veloz-white hover:bg-veloz-gray/50 flex items-center justify-center gap-2"
            onClick={toggleForgotPassword}
          >
            <ArrowLeft size={16} />
            Voltar ao login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;
