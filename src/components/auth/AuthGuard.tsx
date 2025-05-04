
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'sonner';
import { UserProfile } from '@/types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserProfile['role'][];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthChecking } = useUsers();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthChecking) {
      return; // Still checking authentication status
    }

    // Special handling for auxizpro@gmail.com - ensure admin access
    if (user?.email === 'auxizpro@gmail.com') {
      console.log('Admin user verified: auxizpro@gmail.com');
      return; // Allow immediate access
    }

    if (!user) {
      toast.error('Acesso negado. Faça login para continuar.');
      navigate('/auth');
      return;
    }

    // Administrators always have access regardless of status
    if (user.profile?.role === 'administrator') {
      console.log('Administrator access granted');
      return;
    }

    // Check if user is approved
    if (user.profile?.status !== 'approved') {
      toast.error('Sua conta está aguardando aprovação pelo administrador.');
      navigate('/auth');
      return;
    }

    // Check role permissions
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

  // Special handling for auxizpro@gmail.com - guarantee access
  if (user?.email === 'auxizpro@gmail.com') {
    return <>{children}</>;
  }

  // Administrators always get access
  if (user?.profile?.role === 'administrator') {
    return <>{children}</>;
  }

  // If not authenticated or not approved, return null (redirect will happen from useEffect)
  if (!user || (user.profile?.status !== 'approved')) {
    return null;
  }

  // If roles are specified and user doesn't have permission, return null
  if (allowedRoles && user.profile?.role && !allowedRoles.includes(user.profile.role)) {
    return null;
  }

  // Otherwise, render the children
  return <>{children}</>;
};
