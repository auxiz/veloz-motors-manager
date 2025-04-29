import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Array<'administrator' | 'seller' | 'dispatcher' | 'financial'>;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthChecking } = useUsers();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthChecking) {
      return; // Still checking authentication status
    }

    if (!user) {
      toast.error('Acesso negado. Faça login para continuar.');
      navigate('/auth');
      return;
    }

    if (allowedRoles && user.profile?.role && !allowedRoles.includes(user.profile.role)) {
      toast.error('Você não tem permissão para acessar esta página.');
      navigate('/dashboard');
    }
  }, [user, isAuthChecking, navigate, allowedRoles]);

  // Show nothing while checking authentication
  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, return null (redirect will happen from useEffect)
  if (!user) {
    return null;
  }

  // If roles are specified and user doesn't have permission, return null
  if (allowedRoles && user.profile?.role && !allowedRoles.includes(user.profile.role)) {
    return null;
  }

  // Otherwise, render the children
  return <>{children}</>;
};
