
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
    // Clear error when user starts typing
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!form.email || !form.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    try {
      console.log('Submitting login with:', form.email);
      
      // Pass email and password directly without captchaToken
      const { error } = await signIn(form.email, form.password);
      
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

  return {
    form,
    error,
    loading,
    handleChange,
    handleSubmit,
  };
}
