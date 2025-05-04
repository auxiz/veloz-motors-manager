
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAuthForms } from '@/hooks/useAuthForms';
import AuthPage from '@/components/auth/AuthPage';

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const authForms = useAuthForms();
  
  // If already authenticated and approved, redirect to dashboard
  useEffect(() => {
    if (user?.profile?.status === 'approved' || user?.profile?.role === 'administrator') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return <AuthPage {...authForms} />;
};

export default Auth;
