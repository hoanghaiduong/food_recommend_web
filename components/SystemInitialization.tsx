
import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, Database, Cpu, Settings, CheckCircle2, ArrowRight, ArrowLeft, 
  Loader2, Globe, ShieldCheck, Zap, AlertCircle, Terminal, Wifi, HardDrive, 
  MessageSquare, Sun, Moon, Lock, Key, ChevronDown, ChevronUp, Layers, 
  AlertTriangle, RotateCcw, Play, SkipForward, X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSetupWizard } from '../hooks/useSetupWizard';
import { SetupFormData } from '../types/setup';

interface SystemInitializationProps {
  onComplete: () => void;
}

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: WizardStep[] = [
  { id: 1, title: 'Backend & Network', description: 'Configure API Gateway & WebSocket', icon: <Globe size={20} /> },
  { id: 2, title: 'Database Connection', description: 'Primary Data Storage', icon: <Database size={20} /> },
  { id: 3, title: 'Vector Search (RAG)', description: 'Knowledge Base Indexing', icon: <HardDrive size={20} /> },
  { id: 4, title: 'System Bootstrapping', description: 'Schema Migration & Seeds', icon: <Layers size={20} /> },
  { id: 5, title: 'LLM Configuration', description: 'AI Brain & Model Settings', icon: <Cpu size={20} /> },
  { id: 6, title: 'General Site Info', description: 'Bot Identity & Localization', icon: <Settings size={20} /> },
];

// --- Helper Components ---

const GlassInput = ({ 
  label, value, onChange, placeholder, type = "text", required = false, isValid = null, isDarkMode, disabled = false
}: { 
  label: string; value: string; onChange: (val: string) => void; placeholder?: string; type?: string; required?: boolean; isValid?: boolean | null; isDarkMode: boolean; disabled?: boolean;
}) => (
  <div className="space-y-2">
    <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all border
            ${isDarkMode 
              ? 'bg-black/30 border-gray-700 text-white placeholder-gray-600' 
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/20'}
            ${isValid === true 
                ? '!border-brand-lime/50' 
                : isValid === false
                    ? '!border-red-500/50 focus:!border-red-500 focus:!ring-red-500/20'
                    : ''
            }
          `}
        />
        {isValid === true && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-lime animate-in zoom-in duration-200">
                <CheckCircle2 size={16} />
            </div>
        )}
        {isValid === false && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-in zoom-in duration-200">
                <AlertCircle size={16} />
            </div>
        )}
    </div>
  </div>
);

const GlassSelect = ({
    label, value, onChange, options, isDarkMode
}: {
    label: string; value: string; onChange: (val: string) => void; options: string[]; isDarkMode: boolean;
}) => (
    <div className="space-y-2">
        <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`
                  w-full border rounded-xl px-4 py-3 text-sm font-medium outline-none appearance-none cursor-pointer transition-all
                  ${isDarkMode
                    ? 'bg-black/30 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                  }
                  focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/20
                `}
            >
                {options.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>{opt}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ArrowRight size={14} className="rotate-90" />
            </div>
        </div>
    </div>
);

// --- Main Component ---

const SystemInitialization: React.FC<SystemInitializationProps> = ({ onComplete }) => {
  const { isDarkMode, toggleDarkMode, primaryColor } = useTheme();
  
  // Use Custom Hook for Logic
  const {
    currentStep, setCurrentStep,
    formData, setFormData,
    isLoading, logs,
    stepStatus,
    dbInitStatus, setDbInitStatus,
    addLog,
    initAdmin,
    testNetwork,
    testDatabase,
    verifyVector,
    checkDbSchemaStatus,
    runMigration,
    testLlm,
    finishSetup
  } = useSetupWizard();

  const [adminKey, setAdminKey] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Persistence & Boot Check
  useEffect(() => {
    if (logs.length === 0) {
      addLog('INFO', 'System boot sequence initiated...');
      const savedKey = localStorage.getItem('x-admin-key');
      if (savedKey) {
          addLog('SUCCESS', 'Admin Key found in local storage.');
          const savedStep = localStorage.getItem('setup_current_step');
          if (savedStep) setCurrentStep(parseInt(savedStep));
          else setCurrentStep(1);
      } else {
          addLog('WARNING', 'Security check: FAILED (No Admin Key found).');
          setCurrentStep(0);
      }
    }
  }, []);

  useEffect(() => {
    if (currentStep > 0) {
        localStorage.setItem('setup_current_step', currentStep.toString());
    }
  }, [currentStep]);

  // Step 4: Auto-check DB status on entry
  useEffect(() => {
      if (currentStep === 4 && (dbInitStatus === 'checking' || dbInitStatus === 'dirty' || dbInitStatus === 'clean')) {
          checkDbSchemaStatus();
      }
  }, [currentStep]);

  // Auto-scroll Console
  useEffect(() => {
    if (consoleEndRef.current) {
        consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isConsoleMinimized, currentStep]);

  const updateField = (field: keyof SetupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Step 0 Logic ---
  const handleSecureBoot = async () => {
      if (adminKey.length < 6) {
          setAuthError(true);
          addLog('ERROR', 'Validation Failed: Key must be at least 6 characters.');
          setTimeout(() => setAuthError(false), 500);
          return;
      }
      await initAdmin(adminKey);
  };

  // --- Step 4 Handlers ---
  const handleForceReset = async () => {
      setShowResetModal(false);
      await runMigration(true);
  };
  
  const handleSkipMigration = () => {
      addLog('INFO', 'User skipped database migration.');
      setDbInitStatus('migrated'); // Treat as migrated to allow next step
  };

  // --- Navigation ---
  const canGoNext = () => {
      if (currentStep === 4) return dbInitStatus === 'migrated';
      if (currentStep === 6) return true;
      return stepStatus[currentStep] === 'success';
  };

  const handleNext = async () => {
      if (currentStep < 6) {
          setCurrentStep(p => p + 1);
      } else {
          const success = await finishSetup();
          if (success) {
            setTimeout(onComplete, 1000);
          }
      }
  };

  const handleBack = () => {
      if (currentStep > 1) setCurrentStep(p => p - 1);
  };

  // --- Render: Step 0 (Welcome & Security) ---
  if (currentStep === 0) {
      return (
        <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500 relative ${isDarkMode ? 'bg-[#030712]' : 'bg-[#F9FAFB]'}`}>
             <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] transition-colors duration-500 opacity-20" style={{ backgroundColor: primaryColor }} />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-white/10 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-brand-lime/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(132,204,22,0.3)]">
                        <ShieldCheck size={40} className="text-brand-lime drop-shadow-md" />
                    </div>
                    <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome to Weihu Setup</h1>
                    <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        System is currently unsecured. Please create a Master Admin Key to initialize the installation environment.
                    </p>
                    <div className={`space-y-4 text-left ${authError ? 'animate-shake' : ''}`}>
                         <GlassInput label="Create Admin Key" type="password" placeholder="Enter secure passphrase..." value={adminKey} onChange={setAdminKey} isDarkMode={isDarkMode} disabled={isLoading} />
                         <button onClick={handleSecureBoot} disabled={isLoading || !adminKey} className={`w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-lime hover:bg-brand-lime-dark hover:scale-[1.02] shadow-brand-lime/30'}`}>
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                            {isLoading ? 'Securing System...' : 'Secure System & Start'}
                         </button>
                    </div>
                    <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .animate-shake { animation: shake 0.3s ease-in-out; }`}</style>
                </div>
                <div className="mt-6 bg-[#0F172A] rounded-xl border border-gray-800 p-4 font-mono text-[10px] h-48 overflow-y-auto hide-scrollbar shadow-inner opacity-90">
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-800 pb-2">
                         <Terminal size={12} className="text-brand-lime" />
                         <span className="text-gray-400">boot_sequence.log</span>
                    </div>
                    <div className="space-y-1.5">
                        {logs.map((log) => (
                             <div key={log.id} className="flex items-start gap-2">
                                 <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                                 <span className={log.type === 'ERROR' ? 'text-red-500' : log.type === 'SUCCESS' ? 'text-brand-lime' : log.type === 'WARNING' ? 'text-yellow-500' : log.type === 'SQL' ? 'text-blue-400' : 'text-gray-400'}>{log.message}</span>
                             </div>
                        ))}
                        <div ref={consoleEndRef} />
                        {isLoading && (
                            <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                                <span className="w-1.5 h-3 bg-brand-lime"></span><span>Processing...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- Render: Steps 1-6 ---
  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#030712]' : 'bg-[#F9FAFB]'}`}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-500" style={{ backgroundColor: `${primaryColor}20` }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative w-full max-w-6xl h-[800px] flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl z-10 animate-in fade-in zoom-in-95 duration-500">
            {/* LEFT PANEL: Sidebar */}
            <div className="w-full md:w-[280px] flex flex-col p-6 border-b md:border-b-0 md:border-r border-gray-200/50 dark:border-gray-700/50 bg-white/40 dark:bg-black/20 relative transition-colors duration-300">
                <div className="mb-8">
                    <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Weihu Setup</h1>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Configuration Wizard v2.5</p>
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto hide-scrollbar">
                    {STEPS.map((step) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        return (
                            <div key={step.id} className={`relative p-3 rounded-xl border transition-all duration-300 flex items-center gap-3 group ${isActive ? 'bg-brand-lime border-brand-lime text-white shadow-lg shadow-brand-lime/30' : isCompleted ? isDarkMode ? 'bg-white/5 border-transparent text-gray-400' : 'bg-gray-100 border-transparent text-gray-500' : isDarkMode ? 'border-transparent text-gray-600' : 'border-transparent text-gray-400'}`}>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isActive ? 'bg-white/20 text-white' : isCompleted ? 'bg-brand-lime/20 text-brand-lime' : isDarkMode ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-200 text-gray-400'}`}>
                                    {isCompleted ? <CheckCircle2 size={18} /> : step.icon}
                                </div>
                                <div>
                                    <p className={`text-sm font-bold`}>{step.title}</p>
                                    <p className={`text-[10px] ${isActive ? 'text-white/80' : 'opacity-60'}`}>{step.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* RIGHT PANEL: Content */}
            <div className="flex-1 flex flex-col relative h-full">
                <button onClick={toggleDarkMode} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-200/50 dark:bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/30 transition-colors shadow-lg group">
                    {isDarkMode ? <Moon size={20} className="text-white" /> : <Sun size={20} className="text-yellow-600" />}
                </button>

                <div className="flex-1 overflow-y-auto transition-colors duration-500 relative">
                    <div className="p-8 pb-24 max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-300 min-h-full flex flex-col">
                         <div className="flex-1 space-y-6">
                            <div className="mb-8">
                                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{STEPS[currentStep-1].title}</h2>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{STEPS[currentStep-1].description}. Ensure all configurations match your deployment environment.</p>
                            </div>

                            {/* --- STEP 1: NETWORK --- */}
                            {currentStep === 1 && (
                                <>
                                    <GlassInput label="API Base URL" value={formData.apiBaseUrl} onChange={(v) => updateField('apiBaseUrl', v)} placeholder="http://localhost:8000" required isValid={stepStatus[1] === 'success' ? true : stepStatus[1] === 'error' ? false : null} isDarkMode={isDarkMode} disabled={isLoading} />
                                    <GlassInput label="WebSocket URL" value={formData.wsUrl} onChange={(v) => updateField('wsUrl', v)} placeholder="ws://localhost:8000/ws" required isDarkMode={isDarkMode} disabled={isLoading} />
                                    <div className="pt-2">
                                        <button onClick={testNetwork} disabled={isLoading} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'}`}>
                                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Wifi size={16} />} Test Connectivity
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* --- STEP 2: DATABASE --- */}
                            {currentStep === 2 && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <GlassSelect label="Database Type" value={formData.dbType} onChange={(v) => updateField('dbType', v)} options={['PostgreSQL', 'MongoDB', 'MySQL']} isDarkMode={isDarkMode} />
                                        <GlassInput label="Database Name" value={formData.dbName} onChange={(v) => updateField('dbName', v)} isDarkMode={isDarkMode} disabled={isLoading} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2"><GlassInput label="Host" value={formData.dbHost} onChange={(v) => updateField('dbHost', v)} placeholder="localhost" isDarkMode={isDarkMode} disabled={isLoading} /></div>
                                        <GlassInput label="Port" value={formData.dbPort} onChange={(v) => updateField('dbPort', v)} placeholder="5432" isDarkMode={isDarkMode} disabled={isLoading} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <GlassInput label="Username" value={formData.dbUser} onChange={(v) => updateField('dbUser', v)} isDarkMode={isDarkMode} disabled={isLoading} />
                                        <GlassInput label="Password" value={formData.dbPass} onChange={(v) => updateField('dbPass', v)} type="password" isDarkMode={isDarkMode} disabled={isLoading} />
                                    </div>
                                    <div className="pt-2">
                                        <button onClick={testDatabase} disabled={isLoading} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'}`}>
                                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />} Test DB Connection
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* --- STEP 3: VECTOR --- */}
                            {currentStep === 3 && (
                                <>
                                    <GlassSelect label="Provider" value={formData.vectorProvider} onChange={(v) => updateField('vectorProvider', v)} options={['Qdrant', 'Pinecone', 'Milvus', 'ChromaDB']} isDarkMode={isDarkMode} />
                                    <GlassInput label="Cluster URL / Host" value={formData.vectorHost} onChange={(v) => updateField('vectorHost', v)} placeholder="http://localhost:6333" isDarkMode={isDarkMode} disabled={isLoading} />
                                    <GlassInput label="API Key (Optional)" value={formData.vectorKey} onChange={(v) => updateField('vectorKey', v)} type="password" isDarkMode={isDarkMode} disabled={isLoading} />
                                    <GlassInput label="Collection Name" value={formData.vectorCollection} onChange={(v) => updateField('vectorCollection', v)} placeholder="e.g. gym_food_v1" isValid={stepStatus[3] === 'success' ? true : null} isDarkMode={isDarkMode} disabled={isLoading} />
                                    <div className="pt-2 flex items-center gap-3">
                                        <button onClick={verifyVector} disabled={isLoading} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'}`}>
                                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} Verify Collection
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* --- STEP 4: MIGRATION --- */}
                            {currentStep === 4 && (
                                <>
                                    {(dbInitStatus === 'checking' || dbInitStatus === 'migrating' || dbInitStatus === 'checking') && (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                            <Loader2 size={40} className="animate-spin mb-4 text-brand-lime" />
                                            <p>{dbInitStatus === 'migrating' ? 'Executing migrations...' : 'Analyzing schema...'}</p>
                                        </div>
                                    )}
                                    {dbInitStatus === 'clean' && (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} /></div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Database is Empty</h3>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">Ready to install core schema.</p>
                                            <button onClick={() => runMigration(false)} disabled={isLoading} className="bg-brand-lime hover:bg-brand-lime-dark text-white px-8 py-4 rounded-xl font-bold shadow-xl transition-all flex items-center gap-3 mx-auto">
                                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} fill="currentColor" />} Execute Migrations
                                            </button>
                                        </div>
                                    )}
                                    {dbInitStatus === 'dirty' && (
                                        <div className="space-y-6">
                                            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-2xl p-6 flex items-start gap-4">
                                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-600 dark:text-yellow-500 shrink-0"><AlertTriangle size={24} /></div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-500 mb-1">Existing Data Detected</h3>
                                                    <p className="text-sm text-yellow-800/80 dark:text-yellow-200/80">The database <strong>{formData.dbName}</strong> contains tables. Skip or Reset?</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={handleSkipMigration} className="flex-1 py-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"><SkipForward size={18} /> Skip & Continue</button>
                                                <button onClick={() => setShowResetModal(true)} className="flex-1 py-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2"><RotateCcw size={18} /> Force Reset</button>
                                            </div>
                                        </div>
                                    )}
                                    {dbInitStatus === 'migrated' && (
                                        <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                                            <div className="w-16 h-16 bg-brand-lime-bg text-brand-lime-dark rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} /></div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">System Initialized</h3>
                                            <p className="text-gray-500 dark:text-gray-400">Database is ready.</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* --- STEP 5: LLM --- */}
                            {currentStep === 5 && (
                                <>
                                    <GlassSelect label="Provider" value={formData.llmProvider} onChange={(v) => updateField('llmProvider', v)} options={['Gemini', 'OpenAI', 'Anthropic', 'Local LLM (Ollama)']} isDarkMode={isDarkMode} />
                                    <GlassInput label="API Key" value={formData.llmKey} onChange={(v) => updateField('llmKey', v)} type="password" placeholder="sk-..." isDarkMode={isDarkMode} disabled={isLoading} />
                                    <GlassInput label="Model Name" value={formData.llmModel} onChange={(v) => updateField('llmModel', v)} placeholder="gemini-1.5-flash" isDarkMode={isDarkMode} disabled={isLoading} />
                                    <div className="pt-2"><button onClick={testLlm} disabled={isLoading} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md ${isDarkMode ? 'bg-purple-900/20 hover:bg-purple-900/40 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200'}`}>{isLoading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />} Test LLM Response</button></div>
                                </>
                            )}

                            {/* --- STEP 6: GENERAL --- */}
                            {currentStep === 6 && (
                                <>
                                    <GlassInput label="Bot Name" value={formData.botName} onChange={(v) => updateField('botName', v)} isDarkMode={isDarkMode} disabled={isLoading} />
                                    <div className="space-y-2">
                                        <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Welcome Message</label>
                                        <textarea value={formData.welcomeMessage} onChange={(e) => updateField('welcomeMessage', e.target.value)} disabled={isLoading} className={`w-full border rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all min-h-[100px] resize-none ${isDarkMode ? 'bg-black/30 border-gray-700 text-white placeholder-gray-600' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'} focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/20`}/>
                                    </div>
                                    <GlassSelect label="Primary Language" value={formData.language} onChange={(v) => updateField('language', v)} options={['Vietnamese', 'English', 'Japanese']} isDarkMode={isDarkMode} />
                                </>
                            )}
                         </div>

                        <div className={`mt-8 pt-6 border-t flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                            <button onClick={handleBack} disabled={currentStep === 1 || isLoading} className={`flex items-center gap-2 text-sm font-bold transition-colors disabled:opacity-30 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}><ArrowLeft size={16} /> Back</button>
                            <button onClick={handleNext} disabled={!canGoNext() || isLoading} className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all text-white ${!canGoNext() || isLoading ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5' : 'bg-brand-lime hover:bg-brand-lime-dark shadow-[0_0_20px_rgba(132,204,22,0.4)] hover:shadow-[0_0_30px_rgba(132,204,22,0.6)] hover:scale-105'}`}>{currentStep === 6 ? 'Finish Setup' : 'Next Step'} <ArrowRight size={16} /></button>
                        </div>
                    </div>
                </div>

                <div className={`shrink-0 w-full bg-[#0F172A] border-t border-brand-lime/30 transition-all duration-300 ease-in-out flex flex-col ${isConsoleMinimized ? 'h-10' : 'h-64'}`}>
                    <div className="h-10 bg-gray-950 flex items-center justify-between px-4 cursor-pointer hover:bg-gray-900 transition-colors border-b border-white/5" onClick={() => setIsConsoleMinimized(!isConsoleMinimized)}>
                        <div className="flex items-center gap-4">
                             <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500/80"></div><div className="w-3 h-3 rounded-full bg-yellow-500/80"></div><div className="w-3 h-3 rounded-full bg-green-500/80"></div></div>
                             <div className="flex items-center gap-2 text-xs font-mono text-gray-400"><Terminal size={12} className="text-brand-lime" /><span>live_console --verbose</span><span className="w-1.5 h-3 bg-brand-lime animate-pulse"></span></div>
                        </div>
                        <button className="text-gray-500 hover:text-white transition-colors">{isConsoleMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 scroll-smooth bg-[#0F172A]">
                         {logs.map((log) => (
                             <div key={log.id} className="flex items-start gap-3 opacity-90 hover:opacity-100 transition-opacity">
                                 <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                                 <span className={`font-bold shrink-0 w-16 ${log.type === 'INFO' ? 'text-gray-400' : log.type === 'SUCCESS' ? 'text-brand-lime' : log.type === 'WARNING' ? 'text-yellow-400' : log.type === 'SQL' ? 'text-blue-400' : 'text-red-500'}`}>[{log.type}]</span>
                                 <span className={`break-all ${log.type === 'ERROR' ? 'text-red-300' : log.type === 'SQL' ? 'text-blue-300' : 'text-gray-300'}`}>{log.message}</span>
                             </div>
                         ))}
                         <div ref={consoleEndRef} />
                    </div>
                </div>
            </div>
        </div>

        {showResetModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowResetModal(false)} />
                <div className="relative bg-white dark:bg-gray-900 border border-red-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4"><AlertTriangle size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Are you absolutely sure?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action will <strong>permanently delete all existing tables</strong> in '{formData.dbName}'.</p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowResetModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                        <button onClick={handleForceReset} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-500/20 transition-colors">Yes, Delete</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SystemInitialization;
