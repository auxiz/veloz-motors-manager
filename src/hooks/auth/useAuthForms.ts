
import { useState } from 'react';
import { useLoginForm } from './useLoginForm';
import { useResetPasswordForm } from './useResetPasswordForm';

export function useAuthForms() {
  const loginForm = useLoginForm();
  const resetPasswordForm = useResetPasswordForm();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const toggleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotPassword(!showForgotPassword);
    // Clear errors
    loginForm.error !== null && setLoginError(null);
    resetPasswordForm.error !== null && setResetError(null);
  };

  // Helper setters to avoid TypeScript errors
  const setLoginError = (error: string | null) => {
    // This is a workaround since we cannot directly modify the error state
    // from the imported hooks
    if (error === null) {
      // Simulate clearing error by re-entering the form data
      loginForm.handleChange({
        target: { id: 'email', value: loginForm.form.email }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const setResetError = (error: string | null) => {
    if (error === null) {
      // Simulate clearing error by re-entering the form data
      resetPasswordForm.handleChange({
        target: { id: 'email', value: resetPasswordForm.form.email }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return {
    loginForm: {
      ...loginForm.form,
      handleChange: loginForm.handleChange,
      handleSubmit: loginForm.handleSubmit,
    },
    resetForm: {
      ...resetPasswordForm.form,
      handleChange: resetPasswordForm.handleChange,
      handleSubmit: resetPasswordForm.handleSubmit,
    },
    error: showForgotPassword ? resetPasswordForm.error : loginForm.error,
    showForgotPassword,
    loading: loginForm.loading || resetPasswordForm.loading,
    handleLoginChange: loginForm.handleChange,
    handleResetChange: resetPasswordForm.handleChange,
    handleLoginSubmit: loginForm.handleSubmit,
    handleResetSubmit: resetPasswordForm.handleSubmit,
    toggleForgotPassword,
  };
}
