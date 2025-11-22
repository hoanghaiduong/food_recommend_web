
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Save, 
  RefreshCw, 
  MessageSquare, 
  Bot, 
  History, 
  GitCommit, 
  LayoutTemplate, 
  Code, 
  ChevronRight,
  RotateCcw,
  FileDiff,
  Plus,
  X,
  Check,
  Copy
} from 'lucide-react';

// --- Types & Mock Data ---

interface PromptVersion {
  id: string;
  version: string;
  status: 'Active' | 'Draft' | 'Deprecated';
  date: string;
  content: string;
  author: string;
}

const VERSIONS: PromptVersion[] = [
  {
    id: 'v1.0',
    version: 'v1.0',
    status: 'Active',
    date: '2 days ago',
    author: 'Brooklyn S.',
    content: "You are a professional Gym Nutritionist AI. Your goal is to calculate macros based on Vietnamese foods.\n\nContext: {{user_context}}\nDietary Restrictions: {{dietary_preferences}}\n\nAlways prioritize local ingredients and provide alternatives if specific western supplements are not available. Tone: Encouraging, Scientific but accessible."
  },
  {
    id: 'v1.1',
    version: 'v1.1',
    status: 'Draft',
    date: 'Just now',
    author: 'You',
    content: "You are a strict Diet Coach. Analyze the following meal strictly based on calories.\n\nHistory: {{chat_history}}\n\nIf the user exceeds {{daily_limit}}, warn them immediately."
  },
  {
    id: 'v0.9',
    version: 'v0.9',
    status: 'Deprecated',
    date: '1 week ago',
    author: 'Cody F.',
    content: "Help user eat healthy. Be nice."
  }
];

const TEMPLATES = [
  { id: 't1', name: 'Strict Assistant', content: "You are a strict and concise assistant. Do not provide filler words. Output only the answer." },
  { id: 't2', name: 'Creative Persona', content: "You are a creative writer named 'Bard'. Use metaphors and rich imagery in your responses. Context: {{story_context}}" },
  { id: 't3', name: 'JSON Output Only', content: "You are a data parser. Output only valid JSON. No markdown. Schema: {{json_schema}}" },
];

// --- Components ---

const BotConfig: React.FC = () => {
  // State
  const [activeVersionId, setActiveVersionId] = useState<string>('v1.0');
  const [promptContent, setPromptContent] = useState(VERSIONS[0].content);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [compareVersion, setCompareVersion] = useState<PromptVersion | null>(null);

  // Editor Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // --- Sync Scroll ---
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current && lineNumbersRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // --- Variable Insertion ---
  const insertVariable = (varName: string) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = promptContent;
    const newText = text.substring(0, start) + `{{${varName}}}` + text.substring(end);
    
    setPromptContent(newText);
    
    // Restore cursor position after render
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + varName.length + 4, start + varName.length + 4);
      }
    }, 0);
  };

  // --- Syntax Highlighting Logic ---
  const renderHighlightedText = (text: string) => {
    // Split by variable syntax {{...}}
    const parts = text.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);
    return parts.map((part, index) => {
      if (part.match(/^\{\{[a-zA-Z0-9_]+\}\}$/)) {
        return (
            <span 
                key={index} 
                className="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-500/10 rounded-md px-1 border border-purple-200 dark:border-purple-500/20"
            >
                {part}
            </span>
        );
      }
      return <span key={index} className="text-slate-800 dark:text-slate-200">{part}</span>;
    });
  };

  // --- Line Numbers ---
  const lineCount = promptContent.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex h-full gap-4 overflow-hidden pb-2">
        
        {/* --- LEFT COLUMN: Version History --- */}
        <div className="w-64 flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 dark:border-white/10 overflow-hidden flex-shrink-0 transition-colors">
            <div className="p-4 border-b border-white/40 dark:border-white/10 flex items-center gap-2">
                <History size={18} className="text-gray-500 dark:text-gray-400" />
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">History</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {VERSIONS.map((v) => (
                    <div 
                        key={v.id}
                        onClick={() => {
                            setActiveVersionId(v.id);
                            setPromptContent(v.content);
                            setCompareVersion(null);
                            setShowDiff(false);
                        }}
                        className={`p-3 rounded-xl cursor-pointer transition-all border group ${
                            activeVersionId === v.id 
                            ? 'bg-brand-lime-bg dark:bg-brand-lime/10 border-brand-lime-light dark:border-brand-lime/20' 
                            : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent hover:border-gray-100 dark:hover:border-gray-700'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                v.status === 'Active' ? 'bg-brand-lime text-white' : 
                                v.status === 'Draft' ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300' :
                                'bg-red-100 dark:bg-red-900/30 text-red-500'
                            }`}>
                                {v.version}
                            </span>
                            {activeVersionId !== v.id && (
                                <div className="hidden group-hover:flex gap-1">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setCompareVersion(v); setShowDiff(true); }}
                                        title="Compare"
                                        className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded text-gray-400 hover:text-brand-lime transition-colors"
                                    >
                                        <FileDiff size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mb-1">{v.id.substring(0,8)} • {v.author}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{v.date}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* --- MIDDLE COLUMN: IDE Editor --- */}
        <div className="flex-1 flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 dark:border-white/10 overflow-hidden transition-colors relative">
            
            {/* Toolbar */}
            <div className="h-14 border-b border-white/40 dark:border-white/10 flex items-center justify-between px-4 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex items-center gap-3">
                    <GitCommit size={18} className="text-brand-lime" />
                    <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">System Prompt</span>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <button 
                        onClick={() => setShowTemplates(true)}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-brand-lime dark:hover:text-brand-lime bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-lime transition-all shadow-sm"
                    >
                        <LayoutTemplate size={14} /> Load Template
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {['user_context', 'chat_history', 'food_data'].map(variable => (
                        <button 
                            key={variable}
                            onClick={() => insertVariable(variable)}
                            className="flex items-center gap-1 text-[10px] font-bold text-brand-lime-dark dark:text-brand-lime bg-brand-lime-bg dark:bg-brand-lime/10 px-2 py-1 rounded-md border border-brand-lime-light dark:border-brand-lime/20 hover:bg-brand-lime hover:text-white transition-colors"
                        >
                            <Plus size={10} /> {variable}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 relative flex bg-[#F9FAFB] dark:bg-[#0D1117] group">
                
                {/* Line Numbers */}
                <div 
                    ref={lineNumbersRef}
                    className="w-10 pt-4 text-right pr-3 text-xs font-mono text-gray-400 bg-gray-50 dark:bg-[#0D1117] select-none border-r border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                    {lines.map(line => <div key={line} className="leading-6">{line}</div>)}
                </div>

                {/* Editor Container */}
                <div className="flex-1 relative overflow-hidden">
                    {/* Highlight Layer (Underneath) */}
                    <div 
                        ref={highlightRef}
                        className="absolute inset-0 p-4 text-sm font-mono leading-6 whitespace-pre-wrap break-words pointer-events-none z-0"
                        aria-hidden="true"
                    >
                        {renderHighlightedText(promptContent)}
                        {/* Add extra newline to match textarea behavior */}
                        <br />
                    </div>

                    {/* Textarea (Top) */}
                    <textarea 
                        ref={textareaRef}
                        value={promptContent}
                        onChange={(e) => setPromptContent(e.target.value)}
                        onScroll={handleScroll}
                        spellCheck="false"
                        className="absolute inset-0 w-full h-full p-4 text-sm font-mono leading-6 bg-transparent border-none resize-none focus:ring-0 caret-lime-500 whitespace-pre-wrap break-words z-10 outline-none selection:bg-lime-200 selection:text-lime-900 dark:selection:bg-lime-500/30 dark:selection:text-white"
                        style={{ color: 'transparent' }} 
                    />
                </div>
            </div>
            
            {/* Footer Status */}
            <div className="h-8 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between px-4 text-[10px] font-mono text-gray-400">
                <div className="flex gap-4">
                    <span>Ln {promptContent.split('\n').length}, Col {promptContent.length}</span>
                    <span>UTF-8</span>
                </div>
                <span>JetBrains Mono</span>
            </div>

            {/* Diff Overlay (Compare Mode) */}
            {showDiff && compareVersion && (
                <div className="absolute inset-0 bg-white dark:bg-gray-900 z-20 flex flex-col">
                    <div className="h-10 flex items-center justify-between px-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Comparing: {activeVersionId} (Current) vs {compareVersion.version}</span>
                        <button onClick={() => setShowDiff(false)}><X size={16} className="text-gray-500" /></button>
                    </div>
                    <div className="flex-1 flex font-mono text-xs overflow-auto">
                        <div className="flex-1 p-4 border-r border-gray-200 dark:border-gray-700 bg-red-50/30 dark:bg-red-900/10">
                             <h4 className="font-bold text-red-500 mb-2">{compareVersion.version}</h4>
                             <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">{compareVersion.content}</p>
                        </div>
                        <div className="flex-1 p-4 bg-green-50/30 dark:bg-green-900/10">
                             <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">{activeVersionId}</h4>
                             <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{promptContent}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Template Modal */}
            {showTemplates && (
                <div className="absolute inset-0 z-30 bg-black/20 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[400px]">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 dark:text-white">Load Template</h3>
                            <button onClick={() => setShowTemplates(false)}><X size={18} className="text-gray-400" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {TEMPLATES.map(t => (
                                <div 
                                    key={t.id} 
                                    onClick={() => {
                                        setPromptContent(t.content);
                                        setShowTemplates(false);
                                    }}
                                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer group"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm text-gray-800 dark:text-white group-hover:text-brand-lime">{t.name}</span>
                                        <Copy size={14} className="text-gray-300 opacity-0 group-hover:opacity-100" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{t.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* --- RIGHT COLUMN: Params & Preview --- */}
        <div className="w-80 flex flex-col gap-4">
            {/* Parameters Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-5 rounded-3xl shadow-sm border border-white/40 dark:border-white/10 transition-colors">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                    <Code size={16} className="text-gray-400" />
                    Parameters
                </h4>
                <div className="space-y-4">
                    <div>
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Model</label>
                         <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-xl p-2.5 font-medium outline-none">
                            <option>Gemini 1.5 Pro</option>
                            <option>Gemini 1.5 Flash</option>
                            <option>Llama 3.1 70B</option>
                        </select>
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Temp</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">0.7</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.1" className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-lime" />
                    </div>
                </div>
            </div>

            {/* Preview Chat (Mini) */}
            <div className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 dark:border-white/10 flex flex-col overflow-hidden transition-colors">
                <div className="p-3 border-b border-white/40 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <span className="font-bold text-gray-500 dark:text-gray-400 text-xs flex items-center gap-2">
                        <MessageSquare size={14} /> Preview
                    </span>
                    <button className="text-[10px] text-gray-400 hover:text-brand-lime flex items-center gap-1">
                        <RefreshCw size={10} /> Reset
                    </button>
                </div>
                <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50/30 dark:bg-gray-900/20">
                    <div className="flex justify-end">
                        <div className="bg-brand-lime text-white p-2.5 rounded-2xl rounded-tr-none max-w-[90%] text-xs shadow-sm">
                            Suggest a healthy breakfast.
                        </div>
                    </div>
                    <div className="flex justify-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                            <Bot size={14} className="text-gray-500 dark:text-gray-300" />
                        </div>
                        <div className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 p-2.5 rounded-2xl rounded-tl-none max-w-[90%] text-xs shadow-sm border border-gray-100 dark:border-gray-600">
                            How about <span className="font-bold text-brand-lime-dark dark:text-brand-lime">Oatmeal with Berries</span>? It's rich in fiber...
                        </div>
                    </div>
                </div>
                <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Test prompt..." 
                            className="flex-1 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-lime"
                        />
                        <button className="p-2 bg-brand-lime text-white rounded-xl hover:bg-brand-lime-dark transition-colors">
                            <Play size={14} fill="currentColor" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-3 rounded-2xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                    <RotateCcw size={16} /> Restore
                </button>
                <button className="bg-black dark:bg-white text-white dark:text-black py-3 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-gray-300 dark:shadow-none">
                    <Save size={16} /> Deploy
                </button>
            </div>
        </div>

    </div>
  );
};

export default BotConfig;
