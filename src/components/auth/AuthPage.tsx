
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

interface AuthPageProps {
  error: string | null;
  showForgotPassword: boolean;
  toggleForgotPassword: (e: React.MouseEvent) => void;
  loading: boolean;
  handleLoginSubmit: (e: React.FormEvent) => Promise<void>;
  handleRegisterSubmit: (e: React.FormEvent) => Promise<void>;
  handleResetSubmit: (e: React.FormEvent) => Promise<void>;
  loginForm: { email: string; password: string };
  registerForm: { name: string; email: string; password: string };
  resetForm: { email: string };
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRegisterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({
  error,
  showForgotPassword,
  toggleForgotPassword,
  loading,
  handleLoginSubmit,
  handleRegisterSubmit,
  handleResetSubmit,
  loginForm,
  registerForm,
  resetForm,
  handleLoginChange,
  handleRegisterChange,
  handleResetChange,
}) => {
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
            {showForgotPassword ? (
              <ForgotPasswordForm
                resetForm={resetForm}
                handleResetChange={handleResetChange}
                handleResetSubmit={handleResetSubmit}
                toggleForgotPassword={toggleForgotPassword}
                loading={loading}
              />
            ) : (
              <LoginForm
                loginForm={loginForm}
                handleLoginChange={handleLoginChange}
                handleLoginSubmit={handleLoginSubmit}
                toggleForgotPassword={toggleForgotPassword}
                loading={loading}
              />
            )}
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm
              registerForm={registerForm}
              handleRegisterChange={handleRegisterChange}
              handleRegisterSubmit={handleRegisterSubmit}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
        
        <p className="text-center mt-6 text-sm text-gray-400">
          © 2025 Veloz Motors. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
