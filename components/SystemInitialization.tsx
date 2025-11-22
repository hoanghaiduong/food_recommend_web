
import React, { useEffect, useState, useRef } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  XCircle, 
  Loader2, 
  Terminal, 
  Server, 
  Database, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  AlertTriangle, 
  Save, 
  Key, 
  RefreshCw,
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// --- Types ---

interface InitStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  icon: React.ReactNode;
  // Error Configuration
  errorType?: 'missing_key' | 'connection_refused';
  errorMessage?: string;
  shouldFailOnce?: boolean; // Demo flag: fail on first try
  hasFailed?: boolean; // Track failure to prevent infinite loops
  configValues: Record<string, string>; // Store user inputs
}

interface SystemInitializationProps {
  onComplete: () => void;
}

const SystemInitialization: React.FC<SystemInitializationProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>(['> Initializing boot sequence...']);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Initial Steps Configuration
  const [steps, setSteps] = useState<InitStep[]>([
    { 
        id: 'node', 
        label: 'Node.js Environment (v20.11.0)', 
        status: 'pending', 
        icon: <Cpu size={18} />,
        configValues: {} 
    },
    { 
        id: 'python', 
        label: 'Backend Connection (FastAPI)', 
        status: 'pending', 
        icon: <Server size={18} />,
        configValues: {} 
    },
    { 
        id: 'env', 
        label: 'Environment Variables (.env)', 
        status: 'pending', 
        icon: <ShieldCheck size={18} />,
        shouldFailOnce: true, // DEMO: This will fail first
        errorType: 'missing_key',
        errorMessage: 'Missing GOOGLE_API_KEY variable.',
        configValues: { apiKey: '' }
    },
    { 
        id: 'db', 
        label: 'Vector DB (gym_food_v2)', 
        status: 'pending', 
        icon: <Database size={18} />,
        errorType: 'connection_refused', // Fallback type if we needed it
        errorMessage: 'Connection refused at localhost:6333',
        configValues: { host: 'localhost', port: '6333' }
    },
  ]);

  // Helper to add logs with color coding hint
  const addLog = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
    const prefix = type === 'error' ? '[ERR]' : type === 'success' ? '[OK]' : '>';
    setLogs(prev => [...prev, `${prefix} ${text}`]);
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Sequential Execution Logic
  useEffect(() => {
    // If all steps done, finish
    if (currentStepIndex >= steps.length) {
      if (!isComplete) {
        addLog("All systems operational.", 'success');
        addLog("Redirecting to Dashboard...", 'info');
        setTimeout(() => setIsComplete(true), 800);
      }
      return;
    }

    const currentStep = steps[currentStepIndex];

    // Only process if state is 'pending'. 
    // If 'error', we wait for user. If 'loading' or 'success', we do nothing here.
    if (currentStep.status !== 'pending') return;

    const runCheck = async () => {
      // 1. Set Loading
      setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { ...s, status: 'loading' } : s));
      addLog(`Checking ${currentStep.label}...`, 'info');

      // Artificial Delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // 2. Simulate Failure (Demo Logic)
      if (currentStep.shouldFailOnce && !currentStep.hasFailed) {
         setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { 
             ...s, 
             status: 'error', 
             hasFailed: true 
         } : s));
         addLog(`${currentStep.errorMessage}`, 'error');
         addLog(`Action required: Update configuration for ${currentStep.id}`, 'error');
         return; // Stop execution, wait for user fix
      }

      // 3. Success
      setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { ...s, status: 'success' } : s));
      addLog(`${currentStep.label} verified.`, 'success');
      
      // 4. Move to Next
      setCurrentStepIndex(prev => prev + 1);
    };

    runCheck();

  }, [currentStepIndex, steps, isComplete]);

  // Handle User Input Changes in Error Forms
  const handleConfigChange = (stepIndex: number, key: string, value: string) => {
    setSteps(prev => prev.map((s, i) => i === stepIndex ? {
        ...s,
        configValues: { ...s.configValues, [key]: value }
    } : s));
  };

  // Handle Retry Action
  const handleRetry = async (index: number) => {
    const step = steps[index];
    
    // Validations (Mock)
    if (step.errorType === 'missing_key' && !step.configValues.apiKey) {
        addLog("Validation Failed: API Key cannot be empty", 'error');
        return;
    }

    // Set to loading for retry
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, status: 'loading' } : s));
    addLog(`Retrying configuration for ${step.label}...`, 'info');

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Success Transition
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, status: 'success' } : s));
    addLog(`Configuration updated. ${step.label} [OK]`, 'success');

    // Resume Sequence
    setCurrentStepIndex(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 animate-in fade-in duration-300 transition-colors">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-gray-800 h-[650px] transition-all">
        
        {/* Left Column: Interactive Timeline Checklist */}
        <div className="flex-1 p-8 md:p-10 flex flex-col overflow-y-auto relative hide-scrollbar bg-white dark:bg-gray-900 transition-colors">
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-lime rounded-2xl flex items-center justify-center shadow-[0_0_20px_-5px_rgba(132,204,22,0.4)]">
                            <div className="w-5 h-5 bg-white rounded-md"></div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">System Initialization</h1>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1.5">Setup Wizard v2.4.0</p>
                        </div>
                    </div>
                    
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleDarkMode}
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all shadow-sm"
                    >
                        {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                </div>
                
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 text-sm">
                    Verifying system integrity and environment configurations...
                </p>

                {/* Steps Timeline */}
                <div className="flex flex-col">
                    {steps.map((step, index) => {
                        const isLast = index === steps.length - 1;
                        const isActive = step.status === 'loading';
                        const isError = step.status === 'error';
                        const isSuccess = step.status === 'success';
                        const isPending = step.status === 'pending';

                        return (
                            <div key={step.id} className="flex group">
                                {/* 1. Timeline Axis (Left) */}
                                <div className="flex flex-col items-center mr-6 min-w-[40px] relative">
                                    {/* Icon */}
                                    <div className={`
                                        relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 shrink-0
                                        ${isActive 
                                            ? 'bg-lime-500 border-lime-500 text-white scale-110 shadow-[0_0_20px_-5px_rgba(132,204,22,0.6)]' 
                                            : isError
                                                ? 'bg-white dark:bg-gray-900 border-red-500 text-red-500 scale-110 shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)]'
                                                : isSuccess
                                                    ? 'bg-brand-lime border-brand-lime text-white shadow-[0_0_15px_-5px_rgba(132,204,22,0.5)]'
                                                    : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600'
                                        }
                                    `}>
                                        {isActive ? <Loader2 size={20} className="animate-spin" /> : step.icon}
                                    </div>
                                    
                                    {/* Vertical Connector Line */}
                                    {!isLast && (
                                        <div className={`w-[2px] flex-grow my-1 rounded-full transition-colors duration-500 absolute top-10 bottom-[-24px] ${
                                             isSuccess ? 'bg-brand-lime shadow-[0_0_10px_rgba(132,204,22,0.5)]' : 'bg-gray-200 dark:bg-gray-800'
                                        }`}></div>
                                    )}
                                </div>

                                {/* 2. Card Area (Right) */}
                                <div className="flex-1 pb-6">
                                    <div className={`
                                        rounded-3xl p-5 border transition-all duration-500 relative overflow-hidden
                                        ${isActive 
                                            ? 'bg-lime-50 dark:bg-lime-500/10 border-lime-200 dark:border-brand-lime/30 shadow-[0_0_30px_-10px_rgba(132,204,22,0.15)]'
                                            : isError
                                                ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 shadow-[0_0_30px_-10px_rgba(239,68,68,0.1)]'
                                                : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5'
                                        }
                                    `}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className={`font-bold text-sm transition-colors ${
                                                    isActive ? 'text-lime-700 dark:text-brand-lime' : 
                                                    isError ? 'text-red-600 dark:text-red-400' : 
                                                    isSuccess ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                    {step.label}
                                                </h3>
                                                {isPending && <span className="text-[10px] text-gray-400 dark:text-gray-600">Waiting...</span>}
                                            </div>
                                            <div className="flex items-center">
                                                {isSuccess && <CheckCircle2 size={18} className="text-brand-lime" />}
                                                {isPending && <Circle size={18} className="text-gray-300 dark:text-gray-700" />}
                                            </div>
                                        </div>

                                        {/* Interactive Error & Form */}
                                        {isError && (
                                            <div className="mt-3">
                                                <p className="text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1.5 mb-3">
                                                    <AlertTriangle size={12} /> {step.errorMessage}
                                                </p>
                                                
                                                <div className="pl-1 pt-3 border-t border-red-200 dark:border-red-500/20 animate-in slide-in-from-top-2 duration-300">
                                                    {step.errorType === 'missing_key' && (
                                                        <div className="space-y-3">
                                                            <div className="relative w-full">
                                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                                                    <Key size={16} />
                                                                </div>
                                                                <input 
                                                                    type="text" 
                                                                    value={step.configValues.apiKey}
                                                                    onChange={(e) => handleConfigChange(index, 'apiKey', e.target.value)}
                                                                    placeholder="Paste your key starting with AIza..." 
                                                                    className="w-full rounded-xl py-3 pl-11 pr-4 bg-white dark:bg-[#0B1120] border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/50 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-mono text-sm"
                                                                    autoFocus
                                                                />
                                                            </div>
                                                            <button 
                                                                onClick={() => handleRetry(index)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all hover:scale-105 active:scale-95 mt-2"
                                                            >
                                                                <Save size={14} /> Save & Retry
                                                            </button>
                                                        </div>
                                                    )}
                                                     {step.errorType === 'connection_refused' && (
                                                        <div className="space-y-3">
                                                            <div className="flex gap-3">
                                                                <div className="flex-1 relative w-full">
                                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                                                        <Globe size={16} />
                                                                    </div>
                                                                    <input 
                                                                        type="text" 
                                                                        value={step.configValues.host}
                                                                        onChange={(e) => handleConfigChange(index, 'host', e.target.value)}
                                                                        placeholder="localhost"
                                                                        className="w-full rounded-xl py-3 pl-11 pr-4 bg-white dark:bg-[#0B1120] border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/50 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-mono text-sm"
                                                                    />
                                                                </div>
                                                                <div className="w-28 relative w-full">
                                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold z-10">#</div>
                                                                    <input 
                                                                        type="text" 
                                                                        value={step.configValues.port}
                                                                        onChange={(e) => handleConfigChange(index, 'port', e.target.value)}
                                                                        placeholder="6333"
                                                                        className="w-full rounded-xl py-3 pl-8 pr-4 bg-white dark:bg-[#0B1120] border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/50 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-mono text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => handleRetry(index)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 mt-2 border border-gray-200 dark:border-gray-700"
                                                            >
                                                                <RefreshCw size={14} /> Update Connection
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Action */}
            <div className="mt-auto pt-6 h-20 flex items-end">
                {isComplete ? (
                    <button 
                        onClick={onComplete}
                        className="w-full h-14 bg-brand-lime hover:bg-brand-lime-dark text-white text-base font-bold rounded-2xl shadow-[0_0_20px_-5px_rgba(132,204,22,0.5)] hover:shadow-[0_0_30px_-5px_rgba(132,204,22,0.7)] transition-all duration-300 flex items-center justify-center gap-2 animate-pulse-slow"
                    >
                        <span>Go to Dashboard</span>
                        <ArrowRight size={20} />
                    </button>
                ) : (
                    <div className="w-full h-14 flex items-center justify-center text-gray-500 text-sm font-medium bg-gray-100 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 border-dashed">
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Waiting for all systems...
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Terminal / Logs */}
        <div className="hidden md:flex w-[420px] bg-[#0D1117] p-6 flex-col text-xs font-mono relative border-l border-gray-200 dark:border-white/5">
             <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                 <div className="flex items-center gap-2 text-gray-400">
                     <Terminal size={14} />
                     <span className="uppercase tracking-widest font-bold">System Log</span>
                 </div>
                 <div className="flex gap-1.5">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500"></div>
                 </div>
             </div>

             <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-2 scroll-smooth hide-scrollbar"
                style={{ maxHeight: '550px' }}
             >
                {logs.map((log, idx) => {
                    const isError = log.includes('[ERR]');
                    const isSuccess = log.includes('[OK]');
                    return (
                        <div key={idx} className={`break-words leading-relaxed ${
                            isError ? 'text-red-400 bg-red-900/10 border-l-2 border-red-500 pl-2' : 
                            isSuccess ? 'text-brand-lime' : 
                            'text-gray-400'
                        }`}>
                            {log}
                        </div>
                    )
                })}
                {!isComplete && (
                    <div className="flex gap-1 mt-2">
                        <span className="text-brand-lime">_</span>
                        <span className="animate-pulse bg-brand-lime w-2 h-4 block"></span>
                    </div>
                )}
             </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default SystemInitialization;
