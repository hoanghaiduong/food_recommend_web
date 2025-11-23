
import React, { useState } from 'react';
import { ShieldCheck, Lock, Loader2, AlertCircle, Mail, User, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

type AuthView = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

// Reusable Input Component (Consistent Style)
const AuthInput = ({ 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    icon: Icon,
    isDarkMode,
    isPasswordToggle = false,
    error = false
}: {
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ElementType;
    isDarkMode: boolean;
    isPasswordToggle?: boolean;
    error?: boolean;
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPasswordToggle ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="relative">
            <input 
                type={inputType}
                value={value}
                onChange={onChange}
                className={`w-full rounded-xl px-4 py-3.5 pl-11 text-sm font-medium outline-none transition-all border ${
                    error 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : isDarkMode 
                        ? 'bg-black/30 border-gray-700 text-white focus:border-[#84CC16] placeholder-gray-600' 
                        : 'bg-white border-gray-200 text-gray-900 focus:border-[#84CC16] placeholder-gray-400'
                }`}
                placeholder={placeholder}
            />
            {Icon && <Icon size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${error ? 'text-red-500' : 'text-gray-400'}`} />}
            
            {isPasswordToggle && (
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
        </div>
    );
};

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { isDarkMode, primaryColor } = useTheme();
  const [view, setView] = useState<AuthView>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for all forms
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKey, setAdminKey] = useState(''); // Master Key for Login (as previously designed)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey && !email) return; // Allow key or email login based on system config, keeping key for now based on prompt history
    
    setIsLoading(true);
    setError('');

    try {
      // Simulate API Call
      await new Promise(r => setTimeout(r, 800));
      
      if (adminKey && adminKey.length < 6) {
          throw new Error('Invalid Key format');
      }

      localStorage.setItem('x-admin-key', adminKey || 'demo-user-token');
      onLoginSuccess();
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
        await new Promise(r => setTimeout(r, 1500));
        // Success -> Switch to Login
        setView('LOGIN');
        // Optional: show toast message "Account created"
    } catch (err) {
        setError('Registration failed. Please contact admin.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        await new Promise(r => setTimeout(r, 1000));
        // Success -> Go back to Login
        setView('LOGIN');
    } catch (err) {
        setError('Failed to send reset link.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500 relative ${isDarkMode ? 'bg-[#030712]' : 'bg-[#F9FAFB]'}`}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[100px] transition-colors duration-500 opacity-20" style={{ backgroundColor: primaryColor }} />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/40 dark:border-white/10 text-center transition-all">
            
            {/* Logo Area */}
            <div className="w-16 h-16 bg-brand-lime-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-lime/20">
                <ShieldCheck size={32} className="text-brand-lime-dark" />
            </div>
            
            {/* --- VIEW: LOGIN --- */}
            {view === 'LOGIN' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                    <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h1>
                    <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Enter your Master Key to access the dashboard.
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                         <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Master Key</label>
                            <AuthInput 
                                type="password" 
                                placeholder="Enter secure key..." 
                                value={adminKey} 
                                onChange={(e) => setAdminKey(e.target.value)} 
                                icon={Lock} 
                                isDarkMode={isDarkMode} 
                                isPasswordToggle
                                error={!!error}
                            />
                         </div>

                         {error && (
                             <div className="flex items-center gap-2 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-lg animate-in slide-in-from-top-2">
                                 <AlertCircle size={14} /> {error}
                             </div>
                         )}

                         <div className="flex justify-between items-center text-xs mt-2">
                            <button type="button" onClick={() => setView('REGISTER')} className="font-bold text-gray-500 hover:text-brand-lime dark:text-gray-400 dark:hover:text-white transition-colors">Create Account</button>
                            <button type="button" onClick={() => setView('FORGOT_PASSWORD')} className="font-bold text-brand-lime-dark dark:text-brand-lime hover:underline">Forgot Password?</button>
                         </div>

                         <button 
                            type="submit" 
                            disabled={isLoading || !adminKey}
                            className={`w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-lime hover:bg-brand-lime-dark hover:scale-[1.02]'
                            }`}
                         >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
                         </button>
                    </form>
                </div>
            )}

            {/* --- VIEW: REGISTER --- */}
            {view === 'REGISTER' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                    <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
                    <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Join the workspace. Admin approval required.
                    </p>

                    <form onSubmit={handleRegister} className="space-y-4 text-left">
                         <AuthInput placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} isDarkMode={isDarkMode} />
                         <AuthInput placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} icon={User} isDarkMode={isDarkMode} />
                         <AuthInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} icon={Lock} isDarkMode={isDarkMode} isPasswordToggle />
                         <AuthInput type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={Lock} isDarkMode={isDarkMode} error={!!error} />

                         {error && (
                             <div className="flex items-center gap-2 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                 <AlertCircle size={14} /> {error}
                             </div>
                         )}

                         <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-2 ${
                                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-lime hover:bg-brand-lime-dark hover:scale-[1.02]'
                            }`}
                         >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
                         </button>

                         <button type="button" onClick={() => setView('LOGIN')} className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1">
                             <ArrowLeft size={14} /> Back to Login
                         </button>
                    </form>
                </div>
            )}

            {/* --- VIEW: FORGOT PASSWORD --- */}
            {view === 'FORGOT_PASSWORD' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                    <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Reset Password</h1>
                    <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Enter your email to receive a recovery link.
                    </p>

                    <form onSubmit={handleResetPassword} className="space-y-6 text-left">
                         <AuthInput placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} isDarkMode={isDarkMode} />

                         <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
                                isLoading 
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                : 'bg-transparent border-brand-lime text-brand-lime-dark dark:text-brand-lime hover:bg-brand-lime-bg hover:border-brand-lime-dark'
                            }`}
                         >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
                         </button>

                         <button type="button" onClick={() => setView('LOGIN')} className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1">
                             <ArrowLeft size={14} /> Back to Login
                         </button>
                    </form>
                </div>
            )}

        </div>
        <p className="text-center mt-6 text-xs text-gray-400 dark:text-gray-600">
            Powered by Weihu OS v2.5
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
