
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useAuthForms() {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, loading } = useAuth();
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
      // Use a mock captcha token for development purposes
      const captchaToken = "mock-captcha-token";
      
      const { error } = await signIn(loginForm.email, loginForm.password, captchaToken);
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
      // Use a mock captcha token for development purposes
      const captchaToken = "mock-captcha-token";
      
      const { error } = await signUp(registerForm.email, registerForm.password, captchaToken);
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
      // Use a mock captcha token for development purposes
      const captchaToken = "mock-captcha-token";
      
      const { error } = await resetPassword(resetForm.email, captchaToken);
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
    registerForm,
    resetForm,
    error,
    showForgotPassword,
    loading,
    handleLoginChange,
    handleRegisterChange,
    handleResetChange,
    handleLoginSubmit,
    handleRegisterSubmit,
    handleResetSubmit,
    toggleForgotPassword,
  };
}
