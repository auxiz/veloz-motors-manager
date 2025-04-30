
import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';

interface AuthPageProps {
  error: string | null;
  showForgotPassword: boolean;
  toggleForgotPassword: (e: React.MouseEvent) => void;
  loading: boolean;
  handleLoginSubmit: (e: React.FormEvent) => Promise<void>;
  handleResetSubmit: (e: React.FormEvent) => Promise<void>;
  loginForm: { email: string; password: string };
  resetForm: { email: string };
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({
  error,
  showForgotPassword,
  toggleForgotPassword,
  loading,
  handleLoginSubmit,
  handleResetSubmit,
  loginForm,
  resetForm,
  handleLoginChange,
  handleResetChange,
}) => {
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
        
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Área Administrativa
        </h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="w-full">
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
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Veloz Motors. Todos os direitos reservados.
          </p>
          <Link to="/" className="text-sm text-veloz-yellow hover:text-yellow-400 mt-2 block">
            Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
