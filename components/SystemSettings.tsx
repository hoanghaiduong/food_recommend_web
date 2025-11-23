
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
  RefreshCw,
  Globe,
  HardDrive,
  MessageSquare,
  Image as ImageIcon,
  Wifi,
  ShieldCheck,
  RotateCcw,
  UploadCloud,
  Loader2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// --- Shared Components (Reused from Setup Wizard style) ---

const SettingsInput = ({ 
  label, value, onChange, placeholder, type = "text", disabled = false, isDarkMode
}: { 
  label: string; value: string; onChange: (val: string) => void; placeholder?: string; type?: string; disabled?: boolean; isDarkMode: boolean;
}) => (
  <div className="space-y-2">
    <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      {label}
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
          `}
        />
    </div>
  </div>
);

const SettingsSelect = ({
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
        </div>
    </div>
);

const SystemSettings: React.FC = () => {
  const { isDarkMode } = useTheme();

  // --- State ---
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Unified Form Data (Parity with Setup Wizard)
  const [formData, setFormData] = useState({
      // General
      botName: 'GymCoach AI',
      language: 'Vietnamese',
      welcomeMessage: 'Xin chào, tôi có thể giúp gì cho lộ trình tập luyện của bạn?',
      // Network
      apiBaseUrl: 'http://localhost:8000',
      wsUrl: 'ws://localhost:8000/ws',
      // Database
      dbType: 'PostgreSQL',
      dbHost: 'localhost',
      dbPort: '5432',
      dbUser: 'admin',
      dbPass: 'password123',
      dbName: 'weihu_core',
      // Vector
      vectorProvider: 'Qdrant',
      vectorHost: 'http://localhost:6333',
      vectorKey: '',
      vectorCollection: 'gym_food_v2',
      // LLM
      llmProvider: 'Gemini',
      llmKey: 'AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxx',
      llmModel: 'gemini-1.5-flash',
  });

  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

  // --- Handlers ---
  const updateField = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleShowPassword = (field: string) => {
      setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleTestConnection = (type: string) => {
      setIsLoading(true);
      setTestStatus('idle');
      setTimeout(() => {
          setIsLoading(false);
          setTestStatus('success');
          setTimeout(() => setTestStatus('idle'), 2000);
      }, 1500);
  };

  const handleSave = () => {
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          // Show toast logic would go here
      }, 1000);
  };

  // --- Tabs Configuration ---
  const TABS = [
      { id: 'general', label: 'General & Identity', icon: MessageSquare, desc: 'Bot identity and localization' },
      { id: 'network', label: 'Backend & Network', icon: Globe, desc: 'API Gateway configurations' },
      { id: 'database', label: 'Database Connection', icon: Database, desc: 'Primary data storage settings' },
      { id: 'vector', label: 'Knowledge Base', icon: HardDrive, desc: 'Vector DB for RAG' },
      { id: 'llm', label: 'AI Models', icon: Cpu, desc: 'LLM Provider and Keys' },
  ];

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden pb-4">
      <div className="flex flex-col md:flex-row h-full gap-6">
          
          {/* --- LEFT COLUMN: Navigation --- */}
          <div className="w-full md:w-1/4 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
              <div className="mb-4 px-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Settings</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configure core engine parameters.</p>
              </div>
              
              <div className="flex flex-col gap-1">
                  {TABS.map((tab) => {
                      const isActive = activeTab === tab.id;
                      const Icon = tab.icon;
                      return (
                          <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`
                                  group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left border-l-4
                                  ${isActive 
                                      ? 'bg-brand-lime-bg dark:bg-brand-lime/10 border-brand-lime text-brand-lime-dark dark:text-brand-lime shadow-sm' 
                                      : 'bg-transparent border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                  }
                              `}
                          >
                              <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white dark:bg-gray-900 shadow-sm' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700'}`}>
                                  <Icon size={18} />
                              </div>
                              <div>
                                  <p className="text-sm font-bold">{tab.label}</p>
                                  <p className="text-[10px] opacity-70 truncate max-w-[140px]">{tab.desc}</p>
                              </div>
                          </button>
                      )
                  })}
              </div>
          </div>

          {/* --- RIGHT COLUMN: Content --- */}
          <div className="flex-1 flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 dark:border-white/10 overflow-hidden relative transition-colors">
              
              {/* Header */}
              <div className="h-16 border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-8 shrink-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {TABS.find(t => t.id === activeTab)?.icon && React.createElement(TABS.find(t => t.id === activeTab)!.icon, { size: 20, className: 'text-brand-lime' })}
                      {TABS.find(t => t.id === activeTab)?.label}
                  </h3>
                  {/* Global Status/Feedback */}
                  {testStatus === 'success' && (
                      <span className="text-xs font-bold text-brand-lime flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2">
                          <CheckCircle2 size={14} /> Connection Verified
                      </span>
                  )}
                   {testStatus === 'error' && (
                      <span className="text-xs font-bold text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2">
                          <AlertCircle size={14} /> Connection Failed
                      </span>
                  )}
              </div>

              {/* Scrollable Form Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  
                  {/* --- TAB: GENERAL --- */}
                  {activeTab === 'general' && (
                      <div className="space-y-6 max-w-2xl animate-in fade-in zoom-in-95 duration-200">
                          <div className="flex items-center gap-6">
                              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-brand-lime hover:text-brand-lime transition-all group">
                                  <UploadCloud size={24} className="mb-1 group-hover:scale-110 transition-transform" />
                                  <span className="text-[10px] font-bold">Upload Logo</span>
                              </div>
                              <div className="flex-1 space-y-4">
                                  <SettingsInput label="Bot Name" value={formData.botName} onChange={(v) => updateField('botName', v)} isDarkMode={isDarkMode} />
                                  <SettingsSelect label="Primary Language" value={formData.language} onChange={(v) => updateField('language', v)} options={['Vietnamese', 'English', 'Japanese']} isDarkMode={isDarkMode} />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Welcome Message</label>
                              <textarea 
                                value={formData.welcomeMessage} 
                                onChange={(e) => updateField('welcomeMessage', e.target.value)}
                                className={`w-full border rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all min-h-[120px] resize-none ${isDarkMode ? 'bg-black/30 border-gray-700 text-white placeholder-gray-600' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'} focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/20`}
                              />
                          </div>
                      </div>
                  )}

                  {/* --- TAB: NETWORK --- */}
                  {activeTab === 'network' && (
                      <div className="space-y-6 max-w-2xl animate-in fade-in zoom-in-95 duration-200">
                          <SettingsInput label="API Base URL" value={formData.apiBaseUrl} onChange={(v) => updateField('apiBaseUrl', v)} isDarkMode={isDarkMode} />
                          <SettingsInput label="WebSocket URL" value={formData.wsUrl} onChange={(v) => updateField('wsUrl', v)} isDarkMode={isDarkMode} />
                          
                          <div className="pt-4 flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl">
                              <div className="flex items-center gap-3">
                                  <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-500" />
                                  <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium">Changing network settings may require a system restart.</p>
                              </div>
                              <button onClick={() => handleTestConnection('network')} className="text-xs font-bold bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:border-brand-lime flex items-center gap-2">
                                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Wifi size={14} />} Test Connectivity
                              </button>
                          </div>
                      </div>
                  )}

                  {/* --- TAB: DATABASE --- */}
                  {activeTab === 'database' && (
                      <div className="space-y-6 max-w-2xl animate-in fade-in zoom-in-95 duration-200">
                           <div className="grid grid-cols-2 gap-4">
                                <SettingsSelect label="Database Type" value={formData.dbType} onChange={(v) => updateField('dbType', v)} options={['PostgreSQL', 'MongoDB']} isDarkMode={isDarkMode} />
                                <SettingsInput label="Database Name" value={formData.dbName} onChange={(v) => updateField('dbName', v)} isDarkMode={isDarkMode} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2"><SettingsInput label="Host" value={formData.dbHost} onChange={(v) => updateField('dbHost', v)} isDarkMode={isDarkMode} /></div>
                                <SettingsInput label="Port" value={formData.dbPort} onChange={(v) => updateField('dbPort', v)} isDarkMode={isDarkMode} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <SettingsInput label="Username" value={formData.dbUser} onChange={(v) => updateField('dbUser', v)} isDarkMode={isDarkMode} />
                                <div className="relative">
                                    <SettingsInput label="Password" type={showPassword['db'] ? "text" : "password"} value={formData.dbPass} onChange={(v) => updateField('dbPass', v)} isDarkMode={isDarkMode} />
                                    <button 
                                        onClick={() => toggleShowPassword('db')}
                                        className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                    >
                                        {showPassword['db'] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button onClick={() => handleTestConnection('db')} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                     {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />} Test Connection
                                </button>
                                <button className="flex-1 py-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2">
                                     <RotateCcw size={16} /> Emergency Migration
                                </button>
                            </div>
                      </div>
                  )}

                  {/* --- TAB: VECTOR --- */}
                  {activeTab === 'vector' && (
                      <div className="space-y-6 max-w-2xl animate-in fade-in zoom-in-95 duration-200">
                           <SettingsSelect label="Provider" value={formData.vectorProvider} onChange={(v) => updateField('vectorProvider', v)} options={['Qdrant', 'Pinecone', 'Milvus', 'ChromaDB']} isDarkMode={isDarkMode} />
                           <SettingsInput label="Cluster URL / Host" value={formData.vectorHost} onChange={(v) => updateField('vectorHost', v)} isDarkMode={isDarkMode} />
                           <div className="relative">
                                <SettingsInput label="API Key" type={showPassword['vector'] ? "text" : "password"} value={formData.vectorKey} onChange={(v) => updateField('vectorKey', v)} isDarkMode={isDarkMode} />
                                <button 
                                    onClick={() => toggleShowPassword('vector')}
                                    className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                >
                                    {showPassword['vector'] ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                           </div>
                           <SettingsInput label="Collection Name" value={formData.vectorCollection} onChange={(v) => updateField('vectorCollection', v)} isDarkMode={isDarkMode} />
                           
                           <div className="pt-2">
                                <button onClick={() => handleTestConnection('vector')} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2">
                                    <Zap size={16} /> Check Status
                                </button>
                           </div>
                      </div>
                  )}

                  {/* --- TAB: AI MODELS --- */}
                  {activeTab === 'llm' && (
                      <div className="space-y-6 max-w-2xl animate-in fade-in zoom-in-95 duration-200">
                           <SettingsSelect label="Provider" value={formData.llmProvider} onChange={(v) => updateField('llmProvider', v)} options={['Gemini', 'OpenAI', 'Anthropic', 'Local LLM (Ollama)']} isDarkMode={isDarkMode} />
                           <div className="relative">
                                <SettingsInput label="API Key" type={showPassword['llm'] ? "text" : "password"} value={formData.llmKey} onChange={(v) => updateField('llmKey', v)} isDarkMode={isDarkMode} />
                                <button 
                                    onClick={() => toggleShowPassword('llm')}
                                    className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                >
                                    {showPassword['llm'] ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                           </div>
                           <SettingsInput label="Model Name" value={formData.llmModel} onChange={(v) => updateField('llmModel', v)} isDarkMode={isDarkMode} />

                           <div className="pt-4 flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-900/30 rounded-xl">
                              <div className="flex items-center gap-3">
                                  <Cpu size={20} className="text-purple-600 dark:text-purple-400" />
                                  <p className="text-xs text-purple-800 dark:text-purple-300 font-medium">Verify LLM response generation capability.</p>
                              </div>
                              <button onClick={() => handleTestConnection('llm')} className="text-xs font-bold bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:border-purple-400 flex items-center gap-2">
                                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />} Test Response
                              </button>
                          </div>
                      </div>
                  )}

              </div>

              {/* Footer Action */}
              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end">
                  <button 
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-brand-lime text-white hover:bg-brand-lime-dark transition-all px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-lime/30 hover:scale-105 hover:shadow-brand-lime/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {isLoading ? (
                          <>
                              <RefreshCw size={18} className="animate-spin" />
                              <span>Saving...</span>
                          </>
                      ) : (
                          <>
                              <Save size={18} />
                              <span>Save Changes</span>
                          </>
                      )}
                  </button>
              </div>

          </div>
      </div>
    </div>
  );
};

export default SystemSettings;
