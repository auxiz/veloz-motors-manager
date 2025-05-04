
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthActions } from './useAuthActions';
import { AuthError } from './types';

export function useLoginForm() {
  const navigate = useNavigate();
  const { signIn, loading } = useAuthActions();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<'pending' | 'approved' | 'rejected' | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
    // Clear error when user starts typing
    setError(null);
    setUserStatus(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUserStatus(undefined);
    
    if (!form.email || !form.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    try {
      console.log('Submitting login with:', form.email);
      
      // Pass email and password directly without captchaToken
      const { error, user } = await signIn(form.email, form.password);
      
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

      // Check user status
      if (user?.profile) {
        if (user.profile.status === 'pending') {
          setUserStatus('pending');
          setError('Sua conta está aguardando aprovação pelo administrador.');
          return;
        } else if (user.profile.status === 'rejected') {
          setUserStatus('rejected');
          setError('Seu acesso foi negado pelo administrador.');
          return;
        } else if (user.profile.role === 'administrator' || user.profile.status === 'approved') {
          setUserStatus('approved');
          toast.success('Login bem-sucedido');
          navigate('/dashboard');
        }
      } else {
        // No profile means the profile might not be created yet
        setUserStatus('pending');
        setError('Sua conta está sendo processada. Por favor, aguarde.');
      }
      
    } catch (err: any) {
      console.error('Login form error:', err);
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    }
  };

  return {
    form,
    error,
    userStatus,
    loading,
    handleChange,
    handleSubmit,
  };
}
