
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Para demonstração, sem Supabase ainda
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular autenticação
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao sistema da Veloz Motors!",
      });
      navigate('/dashboard');
    }, 1000);
  };

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
          
          <TabsContent value="login">
            <Card className="border-veloz-gray bg-veloz-gray">
              <CardHeader>
                <h2 className="text-2xl font-bold text-center text-veloz-white">Acesse sua conta</h2>
              </CardHeader>
              <form onSubmit={handleAuth}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com"
                      required
                      className="bg-veloz-black border-veloz-gray text-veloz-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <a 
                        href="#" 
                        className="text-sm text-veloz-yellow hover:underline"
                        onClick={(e) => e.preventDefault()}
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
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="border-veloz-gray bg-veloz-gray">
              <CardHeader>
                <h2 className="text-2xl font-bold text-center text-veloz-white">Criar nova conta</h2>
              </CardHeader>
              <form onSubmit={handleAuth}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome</Label>
                    <Input 
                      id="register-name" 
                      type="text"
                      placeholder="Seu nome completo" 
                      required 
                      className="bg-veloz-black border-veloz-gray text-veloz-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="seu@email.com"
                      required
                      className="bg-veloz-black border-veloz-gray text-veloz-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <Input 
                      id="register-password" 
                      type="password"
                      placeholder="••••••••" 
                      required 
                      className="bg-veloz-black border-veloz-gray text-veloz-white"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registrando...' : 'Registrar'}
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
