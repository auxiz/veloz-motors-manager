
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hashPresent, setHashPresent] = useState(false);

  useEffect(() => {
    // Verificar se há um hash na URL (indicando que o usuário veio do link de redefinição)
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setHashPresent(true);
    } else {
      setError('Link de recuperação inválido. Por favor, solicite uma nova redefinição de senha.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      setLoading(true);
      
      // Atualizar a senha usando o token contido na URL
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      toast.success('Senha atualizada com sucesso!');
      setTimeout(() => {
        // Redirecionar para a página de login após atualização bem-sucedida
        navigate('/auth');
      }, 1500);
    } catch (err: any) {
      console.error('Erro ao atualizar senha:', err);
      setError(err.message || 'Erro ao atualizar senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-veloz-black to-[#1a1a1a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-veloz-black border border-gray-800 rounded-2xl shadow-2xl p-6 animate-fade-in">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/4f3db420-b53b-4adc-9b5a-07a1d090a696.png"
            alt="Veloz Motors" 
            className="h-24" 
          />
        </div>
        
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Redefinir Senha</CardTitle>
        </CardHeader>

        {!hashPresent ? (
          <Alert variant="destructive" className="mb-4 border-red-600 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-100">
              Link de recuperação inválido. Por favor, solicite uma nova redefinição de senha.
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert variant="destructive" className="mb-4 border-red-600 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-100">{error}</AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={!hashPresent || loading}
                className="bg-veloz-gray/50 border-gray-700 text-white focus-visible:ring-veloz-yellow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                disabled={!hashPresent || loading}
                className="bg-veloz-gray/50 border-gray-700 text-white focus-visible:ring-veloz-yellow"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="pt-2">
            <Button
              type="submit"
              className="w-full bg-veloz-yellow hover:bg-amber-500 text-veloz-black font-semibold py-5"
              disabled={!hashPresent || loading}
            >
              {loading ? 'Atualizando...' : 'Redefinir Senha'}
            </Button>
          </CardFooter>
        </form>
        
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/auth')}
            className="text-veloz-yellow hover:bg-veloz-gray/50 hover:text-veloz-yellow"
          >
            Voltar para o login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
