
import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Circle, XCircle, Loader2, Terminal, Server, Database, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface InitStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  icon: React.ReactNode;
}

interface SystemInitializationProps {
  onComplete: () => void;
}

const SystemInitialization: React.FC<SystemInitializationProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>(['> Initializing boot sequence...']);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [steps, setSteps] = useState<InitStep[]>([
    { id: 'node', label: 'Node.js Environment (v20.11.0)', status: 'pending', icon: <Cpu size={18} /> },
    { id: 'python', label: 'Backend Connection (FastAPI)', status: 'pending', icon: <Server size={18} /> },
    { id: 'env', label: 'Environment Variables (.env)', status: 'pending', icon: <ShieldCheck size={18} /> },
    { id: 'db', label: 'Vector DB (gym_food_v2)', status: 'pending', icon: <Database size={18} /> },
  ]);

  // Helper to add logs
  const addLog = (text: string) => {
    setLogs(prev => [...prev, `> ${text}`]);
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Sequential Step Logic
  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      // Sequence finished
      if (!isComplete) {
        addLog("All systems go. Ready to launch.");
        setIsComplete(true);
      }
      return;
    }

    const processStep = async () => {
      const step = steps[currentStepIndex];

      // 1. Set Status to Loading
      setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { ...s, status: 'loading' } : s));
      addLog(`Checking ${step.label}...`);

      // 2. Simulate Processing Delay
      const delay = Math.random() * 800 + 1000; // 1s - 1.8s
      await new Promise(resolve => setTimeout(resolve, delay));

      // 3. Set Status to Success
      setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { ...s, status: 'success' } : s));

      // 4. Log detailed success message
      if (step.id === 'env') {
        addLog("Loaded config: GOOGLE_API_KEY [OK]");
        addLog("Loaded config: OLLAMA_BASE_URL [OK]");
      } else if (step.id === 'db') {
        addLog("Connected to Qdrant at localhost:6333... [OK]");
        addLog("Collection 'gym_food_v2' verified.");
      } else {
        addLog(`Verified ${step.id} - OK`);
      }

      // 5. Move to next step
      setCurrentStepIndex(prev => prev + 1);
    };

    processStep();

  }, [currentStepIndex]); // Only re-run when step index changes

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Column: Checklist */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
            <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-brand-lime rounded-xl flex items-center justify-center shadow-lg shadow-lime-200">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-none">System Initialization</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Version 2.4.0</p>
                    </div>
                </div>
                
                <p className="text-gray-500 font-medium mb-8">
                    Checking environment variables & system dependencies...
                </p>

                {/* Checklist */}
                <div className="space-y-5">
                    {steps.map((step) => (
                        <div key={step.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                    step.status === 'success' ? 'bg-brand-lime-bg text-brand-lime-dark' :
                                    step.status === 'loading' ? 'bg-blue-50 text-blue-600' :
                                    step.status === 'error' ? 'bg-red-50 text-red-600' :
                                    'bg-gray-50 text-gray-400'
                                }`}>
                                    {step.icon}
                                </div>
                                <span className={`font-bold text-sm ${
                                    step.status === 'pending' ? 'text-gray-400' : 'text-gray-700'
                                }`}>
                                    {step.label}
                                </span>
                            </div>

                            <div className="pr-2">
                                {step.status === 'pending' && <Circle size={20} className="text-gray-200" />}
                                {step.status === 'loading' && <Loader2 size={20} className="text-blue-500 animate-spin" />}
                                {step.status === 'success' && <CheckCircle2 size={20} className="text-brand-lime-dark drop-shadow-sm scale-110 transition-transform" />}
                                {step.status === 'error' && <XCircle size={20} className="text-red-500" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Action */}
            <div className="mt-10 h-14">
                {isComplete ? (
                    <button 
                        onClick={onComplete}
                        className="w-full h-full bg-brand-lime hover:bg-brand-lime-dark text-white text-base font-bold rounded-2xl shadow-lg shadow-lime-200 hover:shadow-xl hover:shadow-lime-300 transition-all duration-300 flex items-center justify-center gap-2 animate-pulse-slow"
                    >
                        <span>Go to Dashboard</span>
                        <ArrowRight size={20} />
                    </button>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Verifying system integrity...
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Terminal / Mock Logs */}
        <div className="w-full md:w-[380px] bg-[#111827] p-6 flex flex-col text-xs font-mono relative">
             <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                 <div className="flex items-center gap-2 text-gray-400">
                     <Terminal size={14} />
                     <span className="uppercase tracking-widest">Console Output</span>
                 </div>
                 <div className="flex gap-1.5">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500"></div>
                 </div>
             </div>

             <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-2 scroll-smooth hide-scrollbar text-gray-300"
                style={{ maxHeight: '400px' }}
             >
                {logs.map((log, idx) => (
                    <div key={idx} className={`${log.includes('[OK]') ? 'text-brand-lime' : 'text-gray-300'}`}>
                        {log}
                    </div>
                ))}
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
