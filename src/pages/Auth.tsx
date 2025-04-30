
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading, user, resetPassword } = useAuth();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [resetForm, setResetForm] = useState({
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({
      ...registerForm,
      [e.target.id]: e.target.value,
    });
  };

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetForm({
      ...resetForm,
      [e.target.id]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      if (error) {
        setError(error.message);
        return;
      }
      toast.success('Login bem-sucedido');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { error } = await signUp(registerForm.email, registerForm.password);
      if (error) {
        setError(error.message);
        return;
      }
      
      toast.success('Conta criada com sucesso! Verifique seu email.');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!resetForm.email) {
      setError('Por favor, informe seu email.');
      return;
    }
    
    try {
      const { error } = await resetPassword(resetForm.email);
      if (error) {
        setError(error.message);
        return;
      }
      
      toast.success('Email de recuperação enviado com sucesso. Verifique sua caixa de entrada.');
      setShowForgotPassword(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de recuperação');
    }
  };

  const toggleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotPassword(!showForgotPassword);
    setError(null);
  };

  const renderLoginForm = () => (
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
  );

  const renderForgotPasswordForm = () => (
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
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          type="submit" 
          className="w-full bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
          disabled={loading}
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
  );

  return (
    <div className="min-h-screen bg-veloz-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/e5725817-aa18-4795-ac65-ef0ef4f65f98.png"
            alt="Veloz Motors" 
            className="h-24" 
          />
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <TabsContent value="login">
            <Card className="border-veloz-gray bg-veloz-gray">
              <CardHeader>
                <h2 className="text-2xl font-bold text-center text-veloz-white">
                  {showForgotPassword ? 'Recuperar Senha' : 'Acesse sua conta'}
                </h2>
              </CardHeader>
              {showForgotPassword ? renderForgotPasswordForm() : renderLoginForm()}
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="border-veloz-gray bg-veloz-gray">
              <CardHeader>
                <h2 className="text-2xl font-bold text-center text-veloz-white">Criar nova conta</h2>
              </CardHeader>
              <form onSubmit={handleRegisterSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome</Label>
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
                    <Label htmlFor="register-email">Email</Label>
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
                    <Label htmlFor="register-password">Senha</Label>
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
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : 'Registrar'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        
        <p className="text-center mt-6 text-sm text-gray-400">
          © 2025 Veloz Motors. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Auth;
