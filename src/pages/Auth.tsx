
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAuthForms } from '@/hooks/useAuthForms';
import AuthPage from '@/components/auth/AuthPage';

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const authForms = useAuthForms();
  
  // Special handling for auxizpro@gmail.com - always redirect to dashboard
  useEffect(() => {
    if (user?.email === 'auxizpro@gmail.com') {
      console.log('Admin user detected, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
    
    // If already authenticated and approved or is admin, redirect to dashboard
    if (user?.profile?.role === 'administrator' || user?.profile?.status === 'approved') {
      console.log('User is authenticated and approved or is admin:', user);
      navigate('/dashboard');
    } else if (user) {
      console.log('User is authenticated but not approved:', user);
    }
  }, [user, navigate]);

  return <AuthPage {...authForms} />;
};

export default Auth;
