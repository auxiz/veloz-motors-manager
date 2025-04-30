
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthActions } from './useAuthActions';
import { AuthError } from './types';

export function useResetPasswordForm() {
  const { resetPassword, loading } = useAuthActions();
  const [form, setForm] = useState({
    email: '',
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
    
    if (!form.email) {
      setError('Por favor, informe seu email.');
      return;
    }
    
    try {
      const { error } = await resetPassword(form.email);
      if (error) {
        setError(error.message);
        return;
      }
      
      toast.success('Email de recuperação enviado com sucesso. Verifique sua caixa de entrada e clique no link para redefinir sua senha.');
      // Return void as expected by the type
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de recuperação');
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
