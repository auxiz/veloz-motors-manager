
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useAuthForms() {
  const navigate = useNavigate();
  const { signIn, resetPassword, loading } = useAuth();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [resetForm, setResetForm] = useState({
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.id]: e.target.value,
    });
    // Clear error when user starts typing
    setError(null);
  };

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetForm({
      ...resetForm,
      [e.target.id]: e.target.value,
    });
    // Clear error when user starts typing
    setError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!loginForm.email || !loginForm.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    try {
      console.log('Submitting login with:', loginForm.email);
      
      // Pass email and password directly without captchaToken
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        console.error('Login error:', error);
        
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
        } else {
          setError(error.message || 'Erro ao fazer login. Tente novamente.');
        }
        return;
      }
      
      toast.success('Login bem-sucedido');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login form error:', err);
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
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

  return {
    loginForm,
    resetForm,
    error,
    showForgotPassword,
    loading,
    handleLoginChange,
    handleResetChange,
    handleLoginSubmit,
    handleResetSubmit,
    toggleForgotPassword,
  };
}
