
import React, { useState } from 'react';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Server, 
  Database, 
  Activity, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Zap, 
  Settings,
  RefreshCw
} from 'lucide-react';

const SystemSettings: React.FC = () => {
  // --- State ---
  const [geminiKey, setGeminiKey] = useState('AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxx');
  const [showGemini, setShowGemini] = useState(false);
  const [isGeminiValid, setIsGeminiValid] = useState<boolean | null>(null);
  const [isTestingKey, setIsTestingKey] = useState(false);

  const [openaiKey, setOpenaiKey] = useState('');
  const [showOpenAI, setShowOpenAI] = useState(false);

  const [dbHost, setDbHost] = useState('http://localhost:6333');
  const [collectionName, setCollectionName] = useState('gym_food_v2');
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'checking'>('connected');

  const [chunkSize, setChunkSize] = useState(1024);
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-004');
  const [debugMode, setDebugMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- Handlers ---
  const handleTestKey = () => {
    setIsTestingKey(true);
    // Simulate API check
    setTimeout(() => {
      setIsGeminiValid(true);
      setIsTestingKey(false);
    }, 1500);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate Save
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden relative pb-4">
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 pb-24">
        
        {/* Card 1: AI Models & API Keys */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/40 dark:border-white/10 transition-colors">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/40 dark:border-white/10">
              <div className="w-10 h-10 rounded-xl bg-brand-lime-bg flex items-center justify-center text-brand-lime-dark">
                 <Key size={20} />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Models & API Keys</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Manage access tokens for LLM providers.</p>
              </div>
           </div>

           <div className="space-y-6">
              {/* Gemini Key */}
              <div>
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Gemini API Key (Required)</label>
                 <div className="flex gap-3">
                    <div className="relative flex-1">
                       <input 
                          type={showGemini ? "text" : "password"}
                          value={geminiKey}
                          onChange={(e) => setGeminiKey(e.target.value)}
                          className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-lime/50 transition-all"
                          placeholder="Enter your Google AI Studio Key"
                       />
                       <button 
                          onClick={() => setShowGemini(!showGemini)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                       >
                          {showGemini ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                    </div>
                    <button 
                       onClick={handleTestKey}
                       className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 min-w-[100px] justify-center"
                    >
                       {isTestingKey ? <RefreshCw size={16} className="animate-spin" /> : 'Test Key'}
                    </button>
                 </div>
                 {isGeminiValid === true && (
                    <p className="mt-2 text-xs font-bold text-brand-lime-dark dark:text-brand-lime flex items-center gap-1">
                       <CheckCircle2 size={12} /> API Key is valid and active.
                    </p>
                 )}
              </div>

              {/* OpenAI Key */}
              <div>
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">OpenAI API Key (Optional)</label>
                 <div className="relative">
                    <input 
                       type={showOpenAI ? "text" : "password"}
                       value={openaiKey}
                       onChange={(e) => setOpenaiKey(e.target.value)}
                       className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-lime/50 transition-all"
                       placeholder="sk-..."
                    />
                    <button 
                       onClick={() => setShowOpenAI(!showOpenAI)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                       {showOpenAI ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
              </div>

              {/* Default Model */}
              <div>
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Default System Model</label>
                 <div className="relative">
                    <Cpu size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-lime/50 transition-all appearance-none cursor-pointer">
                       <option>Gemini 1.5 Pro (Recommended)</option>
                       <option>Gemini 1.5 Flash</option>
                       <option>GPT-4o</option>
                       <option>Llama 3 70B</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                       <Settings size={16} className="text-gray-400" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Card 2: Vector Database */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/40 dark:border-white/10 transition-colors">
           <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/40 dark:border-white/10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Database size={20} />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Vector Database</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Connection details for RAG engine.</p>
                 </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                 dbStatus === 'connected' 
                    ? 'bg-brand-lime-bg border-brand-lime-light text-brand-lime-dark' 
                    : 'bg-red-50 border-red-100 text-red-600'
              }`}>
                 <div className={`w-2 h-2 rounded-full ${
                    dbStatus === 'connected' ? 'bg-brand-lime' : 'bg-red-500'
                 }`}></div>
                 {dbStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Host URL</label>
                 <div className="relative">
                    <Server size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                       type="text"
                       value={dbHost}
                       onChange={(e) => setDbHost(e.target.value)}
                       className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-lime/50 transition-all"
                    />
                 </div>
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Collection Name</label>
                 <input 
                    type="text"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-lime/50 transition-all"
                 />
              </div>
           </div>
        </div>

        {/* Card 3: System Parameters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/40 dark:border-white/10 transition-colors">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/40 dark:border-white/10">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                 <Activity size={20} />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">System Parameters</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Fine-tune performance & logging.</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Chunk Size */}
                 <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Chunk Size (Tokens)</label>
                    <div className="relative">
                        <input 
                           type="number"
                           value={chunkSize}
                           onChange={(e) => setChunkSize(Number(e.target.value))}
                           className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-lime/50 transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">tokens</span>
                    </div>
                 </div>

                 {/* Embedding Model */}
                 <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Embedding Model</label>
                    <select 
                       value={embeddingModel}
                       onChange={(e) => setEmbeddingModel(e.target.value)}
                       className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-lime/50 transition-all appearance-none cursor-pointer"
                    >
                       <option value="text-embedding-004">text-embedding-004 (Google)</option>
                       <option value="text-embedding-3-small">text-embedding-3-small (OpenAI)</option>
                       <option value="text-embedding-3-large">text-embedding-3-large (OpenAI)</option>
                    </select>
                 </div>
              </div>

              {/* Debug Mode Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${debugMode ? 'bg-brand-lime text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                       <Zap size={20} fill={debugMode ? "currentColor" : "none"} />
                    </div>
                    <div>
                       <p className="font-bold text-gray-900 dark:text-white text-sm">Debug Mode</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">Enable verbose logging for development.</p>
                    </div>
                 </div>
                 <button 
                    onClick={() => setDebugMode(!debugMode)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${debugMode ? 'bg-brand-lime' : 'bg-gray-300 dark:bg-gray-700'}`}
                 >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${debugMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </button>
              </div>
           </div>
        </div>

      </div>

      {/* Floating Footer Action */}
      <div className="absolute bottom-4 right-4 z-10">
         <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-brand-lime text-black hover:bg-brand-lime-dark dark:hover:bg-brand-lime-light transition-all px-8 py-4 rounded-2xl font-bold shadow-xl shadow-brand-lime/30 hover:scale-105 hover:shadow-brand-lime/50"
         >
            {isSaving ? (
               <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Saving...</span>
               </>
            ) : (
               <>
                  <Save size={20} />
                  <span>Save Changes</span>
               </>
            )}
         </button>
      </div>

    </div>
  );
};

export default SystemSettings;
