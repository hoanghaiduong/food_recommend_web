
import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  Settings, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Globe, 
  ShieldCheck, 
  Zap,
  AlertCircle,
  Terminal,
  Wifi,
  HardDrive,
  MessageSquare,
  Sun,
  Moon,
  Minus,
  Maximize2,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// --- Types ---

interface SystemInitializationProps {
  onComplete: () => void;
}

type StepStatus = 'pending' | 'current' | 'completed';
type LogType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

interface LogEntry {
  id: string;
  timestamp: string;
  type: LogType;
  message: string;
}

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FormData {
  // Step 1: Backend
  apiBaseUrl: string;
  wsUrl: string;
  // Step 2: Database
  dbType: string;
  dbHost: string;
  dbPort: string;
  dbUser: string;
  dbPass: string;
  dbName: string;
  // Step 3: Vector
  vectorProvider: string;
  vectorHost: string;
  vectorKey: string;
  vectorCollection: string;
  // Step 4: LLM
  llmProvider: string;
  llmKey: string;
  llmModel: string;
  // Step 5: General
  botName: string;
  welcomeMessage: string;
  language: string;
}

const INITIAL_DATA: FormData = {
  apiBaseUrl: 'http://localhost:8000',
  wsUrl: 'ws://localhost:8000/ws',
  dbType: 'PostgreSQL',
  dbHost: 'localhost',
  dbPort: '5432',
  dbUser: 'admin',
  dbPass: '',
  dbName: 'weihu_core',
  vectorProvider: 'Qdrant',
  vectorHost: 'http://localhost:6333',
  vectorKey: '',
  vectorCollection: 'gym_food_v1',
  llmProvider: 'Gemini',
  llmKey: '',
  llmModel: 'gemini-1.5-flash',
  botName: 'GymCoach AI',
  welcomeMessage: 'Xin chào, tôi có thể giúp gì cho lộ trình tập luyện của bạn?',
  language: 'Vietnamese',
};

const STEPS: WizardStep[] = [
  { id: 1, title: 'Backend & Network', description: 'Configure API Gateway & WebSocket', icon: <Globe size={20} /> },
  { id: 2, title: 'Database Connection', description: 'Primary Data Storage', icon: <Database size={20} /> },
  { id: 3, title: 'Vector Search (RAG)', description: 'Knowledge Base Indexing', icon: <HardDrive size={20} /> },
  { id: 4, title: 'LLM Configuration', description: 'AI Brain & Model Settings', icon: <Cpu size={20} /> },
  { id: 5, title: 'General Site Info', description: 'Bot Identity & Localization', icon: <Settings size={20} /> },
];

// --- Helper Components (Strict Theme Enforcement) ---

const GlassInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  required = false,
  isValid = null,
  isDarkMode
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string; 
  type?: string;
  required?: boolean;
  isValid?: boolean | null;
  isDarkMode: boolean;
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
          className={`
            w-full rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all border
            ${isDarkMode 
              ? 'bg-black/30 border-gray-700 text-white placeholder-gray-600' 
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }
            focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/20
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
    label,
    value,
    onChange,
    options,
    isDarkMode
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: string[];
    isDarkMode: boolean;
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
  
  // Wizard State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  
  // Verification States
  const [stepStatus, setStepStatus] = useState<{ [key: number]: 'pending' | 'success' | 'error' }>({
      1: 'pending', 2: 'pending', 3: 'pending', 4: 'pending', 5: 'pending'
  });
  const [vectorCollectionStatus, setVectorCollectionStatus] = useState<'unknown' | 'exists' | 'missing' | 'created'>('unknown');

  // Console State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    const savedStep = localStorage.getItem('setup_current_step');
    const savedData = localStorage.getItem('setup_form_data');
    if (savedStep) setCurrentStep(parseInt(savedStep));
    if (savedData) setFormData(JSON.parse(savedData));
    
    // Initial Log
    addLog('INFO', 'System Initialization Wizard v2.5 started.');
    addLog('INFO', 'Waiting for user configuration...');
  }, []);

  useEffect(() => {
    localStorage.setItem('setup_current_step', currentStep.toString());
    localStorage.setItem('setup_form_data', JSON.stringify(formData));
  }, [currentStep, formData]);

  // Auto-scroll Console
  useEffect(() => {
    if (consoleEndRef.current) {
        consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isConsoleMinimized]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setStepStatus(prev => ({ ...prev, [currentStep]: 'pending' }));
  };

  // --- Console Logic ---
  const addLog = (type: LogType, message: string) => {
    const entry: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + Math.floor(Math.random() * 999),
        type,
        message
    };
    setLogs(prev => [...prev, entry]);
    // Force console open on new activity if important
    if (type === 'ERROR' || type === 'WARNING') {
        setIsConsoleMinimized(false);
    }
  };

  // --- Simulation Logic ---

  const handleBackendTest = async () => {
    setLoading(true);
    setIsConsoleMinimized(false);
    addLog('INFO', `Initiating handshake with ${formData.apiBaseUrl}...`);
    
    await new Promise(r => setTimeout(r, 800));
    addLog('WARNING', 'Checking CORS policy headers...');
    
    await new Promise(r => setTimeout(r, 800));
    addLog('INFO', 'Verifying WebSocket endpoint accessibility...');

    await new Promise(r => setTimeout(r, 600));
    
    // Success scenario
    addLog('SUCCESS', `Connection established (Latency: 45ms). Version: Python Core v2.4`);
    setStepStatus(prev => ({ ...prev, 1: 'success' }));
    setLoading(false);
  };

  const handleDbTest = async () => {
    setLoading(true);
    setIsConsoleMinimized(false);
    addLog('INFO', `Attempting connection to ${formData.dbType} at ${formData.dbHost}:${formData.dbPort}...`);
    
    await new Promise(r => setTimeout(r, 1000));
    addLog('INFO', `Authenticating as user '${formData.dbUser}'...`);
    
    await new Promise(r => setTimeout(r, 1000));
    
    if (formData.dbPass.length > 0) {
        addLog('SUCCESS', 'Database connection pool initialized. Active connections: 1');
        setStepStatus(prev => ({ ...prev, 2: 'success' }));
    } else {
        addLog('WARNING', 'Using empty password (Not recommended for production).');
        addLog('SUCCESS', 'Database connection established.');
        setStepStatus(prev => ({ ...prev, 2: 'success' }));
    }
    setLoading(false);
  };

  const handleVectorVerify = async () => {
    setLoading(true);
    setIsConsoleMinimized(false);
    addLog('INFO', `Connecting to Vector Provider: ${formData.vectorProvider}...`);
    
    await new Promise(r => setTimeout(r, 1200));

    if (formData.vectorCollection.includes('new')) {
        addLog('WARNING', `Collection '${formData.vectorCollection}' not found.`);
        addLog('ERROR', '404: Collection missing. Please create it.');
        setVectorCollectionStatus('missing');
        setStepStatus(prev => ({ ...prev, 3: 'pending' }));
    } else {
        addLog('SUCCESS', `Collection '${formData.vectorCollection}' found. Dimensions: 1536.`);
        setVectorCollectionStatus('exists');
        setStepStatus(prev => ({ ...prev, 3: 'success' }));
    }
    setLoading(false);
  };

  const handleVectorCreate = async () => {
    setLoading(true);
    addLog('INFO', `Creating collection '${formData.vectorCollection}' with cosine distance...`);
    await new Promise(r => setTimeout(r, 1500));
    addLog('SUCCESS', 'Collection created successfully. Ready for indexing.');
    setVectorCollectionStatus('created');
    setStepStatus(prev => ({ ...prev, 3: 'success' }));
    setLoading(false);
  };

  const handleLlmTest = async () => {
    setLoading(true);
    setIsConsoleMinimized(false);
    addLog('INFO', `Sending test prompt to ${formData.llmProvider} (${formData.llmModel})...`);
    
    await new Promise(r => setTimeout(r, 1500));
    
    if (formData.llmProvider === 'Gemini') {
        addLog('SUCCESS', 'Response received: "Hello! I am Gemini, ready to assist."');
        addLog('INFO', 'Token usage: 45 prompt, 12 completion.');
        setStepStatus(prev => ({ ...prev, 4: 'success' }));
    } else {
        addLog('SUCCESS', 'LLM Handshake successful.');
        setStepStatus(prev => ({ ...prev, 4: 'success' }));
    }
    setLoading(false);
  };

  // --- Navigation ---
  const canGoNext = () => {
      if (currentStep === 5) return true;
      return stepStatus[currentStep] === 'success';
  };

  const handleNext = () => {
      if (currentStep < 5) {
          setCurrentStep(p => p + 1);
          addLog('INFO', `Transitioning to Step ${currentStep + 1}...`);
      } else {
          addLog('SUCCESS', 'Setup complete. Redirecting to Dashboard...');
          setTimeout(onComplete, 1000);
      }
  };

  const handleBack = () => {
      if (currentStep > 1) setCurrentStep(p => p - 1);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#030712]' : 'bg-[#F9FAFB]'}`}>
        
        {/* Background Gradient Orb (Unified) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div 
              className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-500"
              style={{ backgroundColor: `${primaryColor}20` }} 
            />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"></div>
        </div>

        {/* Main Glass Container */}
        <div className="relative w-full max-w-6xl h-[800px] flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl z-10 animate-in fade-in zoom-in-95 duration-300">
            
            {/* LEFT PANEL: Sidebar (Responsive Step Indicator) */}
            <div className="w-full md:w-[280px] flex flex-col p-6 border-b md:border-b-0 md:border-r border-gray-200/50 dark:border-gray-700/50 bg-white/40 dark:bg-black/20 relative transition-colors duration-300">
                <div className="mb-8">
                    <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Weihu Setup</h1>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Configuration Wizard v2.5</p>
                </div>

                <div className="space-y-2 flex-1">
                    {STEPS.map((step) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        
                        return (
                            <div 
                                key={step.id}
                                className={`
                                    relative p-3 rounded-xl border transition-all duration-300 flex items-center gap-3 group
                                    ${isActive 
                                        ? 'bg-brand-lime border-brand-lime text-white shadow-lg shadow-brand-lime/30' 
                                        : isCompleted
                                            ? isDarkMode ? 'bg-white/5 border-transparent text-gray-400' : 'bg-gray-100 border-transparent text-gray-500'
                                            : isDarkMode ? 'border-transparent text-gray-600' : 'border-transparent text-gray-400'
                                    }
                                `}
                            >
                                <div className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0
                                    ${isActive 
                                        ? 'bg-white/20 text-white' 
                                        : isCompleted 
                                            ? 'bg-brand-lime/20 text-brand-lime' 
                                            : isDarkMode ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-200 text-gray-400'
                                    }
                                `}>
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

                <div className="mt-auto pt-6 border-t border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                         <div className="w-2 h-2 rounded-full bg-brand-lime animate-pulse"></div>
                         <span>System Healthy</span>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Content (Form + Console) */}
            <div className="flex-1 flex flex-col relative h-full">
                
                {/* THEME TOGGLE (Floating) */}
                <button 
                    onClick={toggleDarkMode}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-200/50 dark:bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/30 transition-colors shadow-lg group"
                >
                    {isDarkMode ? <Moon size={20} className="text-white" /> : <Sun size={20} className="text-yellow-600" />}
                </button>

                {/* UPPER: Form Wizard Area */}
                <div className="flex-1 overflow-y-auto transition-colors duration-500 relative">
                    <div className="p-8 pb-24 max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-300 min-h-full flex flex-col">
                         
                         {/* Step Content */}
                         <div className="flex-1 space-y-6">
                            
                            {/* Step Header */}
                            <div className="mb-8">
                                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {STEPS[currentStep-1].title}
                                </h2>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {STEPS[currentStep-1].description}. Ensure all configurations match your deployment environment.
                                </p>
                            </div>

                            {/* --- STEP 1: NETWORK --- */}
                            {currentStep === 1 && (
                                <>
                                    <GlassInput 
                                        label="API Base URL" 
                                        value={formData.apiBaseUrl} 
                                        onChange={(v) => updateField('apiBaseUrl', v)} 
                                        placeholder="http://localhost:8000"
                                        required
                                        isValid={stepStatus[1] === 'success' ? true : stepStatus[1] === 'error' ? false : null}
                                        isDarkMode={isDarkMode}
                                    />
                                    <GlassInput 
                                        label="WebSocket URL" 
                                        value={formData.wsUrl} 
                                        onChange={(v) => updateField('wsUrl', v)} 
                                        placeholder="ws://localhost:8000/ws"
                                        required
                                        isDarkMode={isDarkMode}
                                    />
                                    <div className="pt-2">
                                        <button 
                                            onClick={handleBackendTest}
                                            disabled={loading}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'}`}
                                        >
                                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Wifi size={16} />}
                                            Test Connectivity
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* --- STEP 2: DATABASE --- */}
                            {currentStep === 2 && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <GlassSelect label="Database Type" value={formData.dbType} onChange={(v) => updateField('dbType', v)} options={['PostgreSQL', 'MongoDB', 'MySQL']} isDarkMode={isDarkMode} />
                                        <GlassInput label="Database Name" value={formData.dbName} onChange={(v) => updateField('dbName', v)} isDarkMode={isDarkMode} />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <GlassInput label="Host" value={formData.dbHost} onChange={(v) => updateField('dbHost', v)} placeholder="localhost" isDarkMode={isDarkMode} />
                                        </div>
                                        <GlassInput label="Port" value={formData.dbPort} onChange={(v) => updateField('dbPort', v)} placeholder="5432" isDarkMode={isDarkMode} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <GlassInput label="Username" value={formData.dbUser} onChange={(v) => updateField('dbUser', v)} isDarkMode={isDarkMode} />
                                        <GlassInput label="Password" value={formData.dbPass} onChange={(v) => updateField('dbPass', v)} type="password" isDarkMode={isDarkMode} />
                                    </div>

                                    <div className="pt-2">
                                        <button 
                                            onClick={handleDbTest}
                                            disabled={loading}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'}`}
                                        >
                                            {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                            Test DB Connection
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* --- STEP 3: VECTOR --- */}
                            {currentStep === 3 && (
                                <>
                                    <GlassSelect label="Provider" value={formData.vectorProvider} onChange={(v) => updateField('vectorProvider', v)} options={['Qdrant', 'Pinecone', 'Milvus', 'ChromaDB']} isDarkMode={isDarkMode} />
                                    
                                    <GlassInput label="Cluster URL / Host" value={formData.vectorHost} onChange={(v) => updateField('vectorHost', v)} placeholder="http://localhost:6333" isDarkMode={isDarkMode} />
                                    
                                    <GlassInput label="API Key (Optional)" value={formData.vectorKey} onChange={(v) => updateField('vectorKey', v)} type="password" isDarkMode={isDarkMode} />

                                    <GlassInput 
                                        label="Collection Name" 
                                        value={formData.vectorCollection} 
                                        onChange={(v) => {
                                            updateField('vectorCollection', v);
                                            setVectorCollectionStatus('unknown');
                                        }} 
                                        placeholder="e.g. gym_food_v1"
                                        isValid={vectorCollectionStatus === 'exists' || vectorCollectionStatus === 'created' ? true : null}
                                        isDarkMode={isDarkMode}
                                    />

                                    <div className="pt-2 flex items-center gap-3">
                                        {vectorCollectionStatus !== 'missing' && (
                                            <button 
                                                onClick={handleVectorVerify}
                                                disabled={loading || vectorCollectionStatus === 'exists' || vectorCollectionStatus === 'created'}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md disabled:opacity-50 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'}`}
                                            >
                                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                                                {vectorCollectionStatus === 'exists' || vectorCollectionStatus === 'created' ? 'Verified' : 'Verify Collection'}
                                            </button>
                                        )}

                                        {vectorCollectionStatus === 'missing' && (
                                            <button 
                                                onClick={handleVectorCreate}
                                                disabled={loading}
                                                className="flex items-center gap-2 bg-brand-lime hover:bg-brand-lime-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-lime/20"
                                            >
                                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Terminal size={16} />}
                                                Create Collection Now
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* --- STEP 4: LLM --- */}
                            {currentStep === 4 && (
                                <>
                                    <GlassSelect label="Provider" value={formData.llmProvider} onChange={(v) => updateField('llmProvider', v)} options={['Gemini', 'OpenAI', 'Anthropic', 'Local LLM (Ollama)']} isDarkMode={isDarkMode} />
                                    
                                    <GlassInput label="API Key" value={formData.llmKey} onChange={(v) => updateField('llmKey', v)} type="password" placeholder="sk-..." isDarkMode={isDarkMode} />
                                    
                                    <GlassInput label="Model Name" value={formData.llmModel} onChange={(v) => updateField('llmModel', v)} placeholder="gemini-1.5-flash" isDarkMode={isDarkMode} />

                                    <div className="pt-2">
                                        <button 
                                            onClick={handleLlmTest}
                                            disabled={loading}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md ${isDarkMode ? 'bg-purple-900/20 hover:bg-purple-900/40 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200'}`}
                                        >
                                            {loading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                                            Test LLM Response
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* --- STEP 5: GENERAL --- */}
                            {currentStep === 5 && (
                                <>
                                    <GlassInput label="Bot Name" value={formData.botName} onChange={(v) => updateField('botName', v)} isDarkMode={isDarkMode} />
                                    
                                    <div className="space-y-2">
                                        <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Welcome Message</label>
                                        <textarea 
                                            value={formData.welcomeMessage}
                                            onChange={(e) => updateField('welcomeMessage', e.target.value)}
                                            className={`
                                              w-full border rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all min-h-[100px] resize-none
                                              ${isDarkMode 
                                                ? 'bg-black/30 border-gray-700 text-white placeholder-gray-600' 
                                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                              }
                                              focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/20
                                            `}
                                        />
                                    </div>

                                    <GlassSelect label="Primary Language" value={formData.language} onChange={(v) => updateField('language', v)} options={['Vietnamese', 'English', 'Japanese']} isDarkMode={isDarkMode} />
                                </>
                            )}
                         </div>

                        {/* Navigation Actions */}
                        <div className={`mt-8 pt-6 border-t flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                            <button 
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className={`flex items-center gap-2 text-sm font-bold transition-colors disabled:opacity-30 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>

                            <button 
                                onClick={handleNext}
                                disabled={!canGoNext()}
                                className={`
                                    flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all text-white
                                    ${!canGoNext() 
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5' 
                                        : 'bg-brand-lime hover:bg-brand-lime-dark shadow-[0_0_20px_rgba(132,204,22,0.4)] hover:shadow-[0_0_30px_rgba(132,204,22,0.6)] hover:scale-105'
                                    }
                                `}
                            >
                                {currentStep === 5 ? 'Finish Setup' : 'Next Step'}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* LOWER: Live Console (Sticky Bottom - ALWAYS DARK) */}
                <div 
                   className={`
                     shrink-0 w-full bg-[#0F172A] border-t border-brand-lime/30 transition-all duration-300 ease-in-out flex flex-col
                     ${isConsoleMinimized ? 'h-10' : 'h-64'}
                   `}
                >
                    {/* Console Header */}
                    <div 
                        className="h-10 bg-gray-950 flex items-center justify-between px-4 cursor-pointer hover:bg-gray-900 transition-colors border-b border-white/5"
                        onClick={() => setIsConsoleMinimized(!isConsoleMinimized)}
                    >
                        <div className="flex items-center gap-4">
                             <div className="flex gap-2">
                                 <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
                                 <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
                                 <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>
                             </div>
                             <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                                 <Terminal size={12} className="text-brand-lime" />
                                 <span>live_console --verbose</span>
                                 {/* Blinking Cursor */}
                                 <span className="w-1.5 h-3 bg-brand-lime animate-pulse"></span>
                             </div>
                        </div>
                        <button className="text-gray-500 hover:text-white transition-colors">
                             {isConsoleMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>

                    {/* Console Body */}
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 scroll-smooth bg-[#0F172A]">
                         {logs.map((log) => (
                             <div key={log.id} className="flex items-start gap-3 opacity-90 hover:opacity-100 transition-opacity">
                                 <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                                 <span className={`font-bold shrink-0 w-16 ${
                                     log.type === 'INFO' ? 'text-gray-400' :
                                     log.type === 'SUCCESS' ? 'text-brand-lime' :
                                     log.type === 'WARNING' ? 'text-yellow-400' : 'text-red-500'
                                 }`}>
                                     [{log.type}]
                                 </span>
                                 <span className={`break-all ${
                                      log.type === 'ERROR' ? 'text-red-300' : 'text-gray-300'
                                 }`}>
                                     {log.message}
                                 </span>
                             </div>
                         ))}
                         <div ref={consoleEndRef} />
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default SystemInitialization;
