
import { useCallback } from 'react';

export const useAuth = () => {
  const logout = useCallback(() => {
    // 1. Remove Auth Key
    localStorage.removeItem('x-admin-key');

    // 2. Dispatch event to notify SetupGuard
    // This allows the app to switch to LoginScreen without a hard reload,
    // preserving the SPA state management flow.
    window.dispatchEvent(new Event('auth-unauthorized'));
    
    // Optional: If you want to force a reload to clear memory/state
    // window.location.href = '/login'; 
  }, []);

  return { logout };
};
