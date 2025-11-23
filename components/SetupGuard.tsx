
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { publicApi } from '../services/api';
import SystemInitialization from './SystemInitialization';
import LoginScreen from './LoginScreen';
import { useTheme } from '../contexts/ThemeContext';

interface SetupGuardProps {
  children: React.ReactNode;
}

type SystemStatus = 'loading' | 'pending' | 'completed';

const SetupGuard: React.FC<SetupGuardProps> = ({ children }) => {
  const [status, setStatus] = useState<SystemStatus>('loading');
  const [hasAuthKey, setHasAuthKey] = useState<boolean>(false);
  const { isDarkMode, primaryColor } = useTheme();

  const checkSystemStatus = async () => {
    try {
      // Call the new API endpoint
      // Note: If backend is not running, this will fail. We handle fail gracefully for demo.
      const response = await publicApi.get('/setup/status');
      
      const serverStatus = response.data?.status; // 'completed' | 'pending'
      
      if (serverStatus === 'completed') {
        validateAuth();
        setStatus('completed');
      } else {
        setStatus('pending');
      }
    } catch (error) {
      console.warn('Failed to check system status, falling back to local check.', error);
      // Fallback Logic for Demo / Dev environment without backend
      const localStatus = localStorage.getItem('system_setup_status');
      if (localStatus === 'completed') {
          validateAuth();
          setStatus('completed');
      } else {
          setStatus('pending');
      }
    }
  };

  const validateAuth = () => {
      const key = localStorage.getItem('x-admin-key');
      setHasAuthKey(!!key);
  };

  useEffect(() => {
    checkSystemStatus();

    // Listen for unauthorized events from api.ts interceptor
    const handleAuthError = () => {
        setHasAuthKey(false);
        setStatus('completed'); // Ensure we are in "completed" state so Login shows
    };

    window.addEventListener('auth-unauthorized', handleAuthError);
    return () => window.removeEventListener('auth-unauthorized', handleAuthError);
  }, []);

  // Handler when Setup Wizard finishes
  const handleSetupComplete = () => {
      localStorage.setItem('system_setup_status', 'completed');
      validateAuth();
      setStatus('completed');
  };

  // Handler when Login finishes
  const handleLoginSuccess = () => {
      validateAuth();
  };

  // --- RENDER LOGIC ---

  if (status === 'loading') {
      return (
          <div className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-[#030712]' : 'bg-[#F9FAFB]'}`}>
              <Loader2 size={48} className="text-brand-lime animate-spin mb-4" />
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 animate-pulse">Initializing Weihu OS...</p>
          </div>
      );
  }

  // CASE 1: System Not Setup -> Force Setup Wizard
  if (status === 'pending') {
      return <SystemInitialization onComplete={handleSetupComplete} />;
  }

  // CASE 2: System Setup but No Auth Key -> Force Login
  if (status === 'completed' && !hasAuthKey) {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // CASE 3: System Setup & Auth Key Present -> Dashboard (Children)
  return <>{children}</>;
};

export default SetupGuard;
