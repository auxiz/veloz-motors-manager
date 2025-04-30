
import { useAuthForms as useAuthFormsInternal } from './auth/useAuthForms';

// Re-export the hook with the same interface for backward compatibility
export function useAuthForms() {
  return useAuthFormsInternal();
}
