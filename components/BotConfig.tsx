
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Save, 
  RefreshCw, 
  Bot, 
  History, 
  GitCommit, 
  Code, 
  Check,
  ChevronDown,
  Zap,
  Sliders,
  FileDiff,
  Settings
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// --- Types & Mock Data ---

interface PromptVersion {
  id: string;
  label: string;
  status: 'Production' | 'Draft' | 'Deprecated';
  content: string;
}

const VERSIONS: PromptVersion[] = [
  {
    id: 'v1.0',
    label: 'v1.0 (Production)',
    status: 'Production',
    content: "You are a professional Gym Nutritionist AI. Your goal is to calculate macros based on Vietnamese foods.\n\nContext: {{user_context}}\nDietary Restrictions: {{dietary_preferences}}\n\nAlways prioritize local ingredients and provide alternatives if specific western supplements are not available. Tone: Encouraging, Scientific but accessible."
  },
  {
    id: 'v1.1',
    label: 'v1.1 (Draft)',
    status: 'Draft',
    content: "You are a strict Diet Coach. Analyze the following meal strictly based on calories.\n\nHistory: {{chat_history}}\n\nIf the user exceeds {{daily_limit}}, warn them immediately. Use short sentences."
  }
];

const SAMPLE_RESPONSE_V1 = "Based on your inputs, Pho Bo typically has 350-400kcal per bowl. I recommend checking the broth fat content.";
const SAMPLE_RESPONSE_V1_1 = "Warning: Pho Bo contains approx 400kcal. This exceeds your snack limit of 300kcal. Avoid the broth.";

// Shared styles to guarantee pixel-perfect alignment between Input and Render layers
const SHARED_EDITOR_STYLES = {
    typography: "font-mono text-sm leading-6 tracking-normal",
    layout: "p-6 w-full h-full border-none outline-none resize-none whitespace-pre-wrap break-words m-0",
    smoothing: "antialiased subpixel-antialiased", // Enforce crisp text rendering
};

// --- Components ---

const BotConfig: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  // State
  const [activeVersionId, setActiveVersionId] = useState<string>('v1.1');
  const [promptContent, setPromptContent] = useState(VERSIONS[1].content);
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(40);
  const [isCompareMode, setIsCompareMode] = useState(false);
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
      { role: 'user', content: 'How many calories in Pho Bo?' },
      { role: 'assistant', content: SAMPLE_RESPONSE_V1_1 }
  ]);

  // Refs for Editor
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Editor Logic
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current && lineNumbersRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);
    return parts.map((part, index) => {
      if (part.match(/^\{\{[a-zA-Z0-9_]+\}\}$/)) {
        // Crisp variable highlighting
        return (
            <span key={index} className="text-purple-600 dark:text-purple-400 font-bold">
                {part}
            </span>
        );
      }
      // Default text style
      return <span key={index} className="text-gray-800 dark:text-gray-300">{part}</span>;
    });
  };

  const lineCount = promptContent.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 20) }, (_, i) => i + 1);

  // Slider Style Injection
  const sliderStyle = `
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: #84CC16;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(132, 204, 22, 0.8);
      margin-top: -6px; 
      border: 2px solid #fff;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
      background: ${isDarkMode ? '#4B5563' : '#E5E7EB'};
      border-radius: 2px;
    }
    input[type=range]:focus::-webkit-slider-thumb {
       box-shadow: 0 0 15px rgba(132, 204, 22, 1);
       transform: scale(1.1);
    }
  `;

  return (
    <div className="flex-1 flex h-full overflow-hidden rounded-3xl shadow-2xl border border-white/40 dark:border-white/5 bg-white dark:bg-[#0D1117] relative transition-colors duration-300">
        <style>{sliderStyle}</style>
        
        {/* --- LEFT PANEL: Configuration (50%) --- */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D1117] relative transition-colors duration-300">
            
            {/* 1. Config Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D1117]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-lime-bg flex items-center justify-center text-brand-lime-dark">
                        <GitCommit size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">System Configuration</h3>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Ready
                        </div>
                    </div>
                </div>

                {/* Version Dropdown */}
                <div className="relative group z-20">
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-all focus:ring-2 focus:ring-brand-lime/50 focus:outline-none">
                        <History size={14} className="text-brand-lime" />
                        <span>{VERSIONS.find(v => v.id === activeVersionId)?.label}</span>
                        <ChevronDown size={14} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        {VERSIONS.map(v => (
                            <div 
                                key={v.id} 
                                onClick={() => { setActiveVersionId(v.id); setPromptContent(v.content); }}
                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between"
                            >
                                <span className={`text-xs font-bold ${activeVersionId === v.id ? 'text-brand-lime' : 'text-gray-700 dark:text-gray-400'}`}>
                                    {v.label}
                                </span>
                                {activeVersionId === v.id && <Check size={12} className="text-brand-lime" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. VS Code Style Editor */}
            <div className="flex-1 relative flex flex-col min-h-0">
                {/* Toolbar */}
                <div className="h-10 bg-gray-50 dark:bg-[#010409] border-b border-gray-200 dark:border-white/5 flex items-center px-4 gap-4 overflow-x-auto hide-scrollbar transition-colors shrink-0">
                     <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#0D1117] border-t-2 border-brand-lime text-xs font-mono text-gray-900 dark:text-white shadow-sm dark:shadow-none">
                        <Code size={12} className="text-brand-lime" />
                        system_prompt.txt
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1 text-xs font-mono text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 cursor-pointer transition-colors">
                         <Settings size={12} />
                         config.json
                     </div>
                     <div className="ml-auto flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">Variables:</span>
                        {['user_context', 'chat_history'].map(v => (
                            <button 
                                key={v}
                                onClick={() => {
                                    const newText = promptContent + ` {{${v}}}`;
                                    setPromptContent(newText);
                                }}
                                className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 rounded border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-brand-lime hover:border-brand-lime/50 transition-all"
                            >
                                {v}
                            </button>
                        ))}
                     </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 relative flex bg-white dark:bg-[#0D1117] group overflow-hidden transition-colors">
                     {/* Line Numbers */}
                    <div ref={lineNumbersRef} className="w-12 pt-6 text-right pr-3 text-sm font-mono text-gray-300 dark:text-gray-700 bg-gray-50 dark:bg-[#0D1117] select-none border-r border-gray-100 dark:border-white/5 overflow-hidden leading-6 transition-colors">
                        {lines.map(line => <div key={line}>{line}</div>)}
                    </div>

                    <div className="flex-1 relative h-full overflow-hidden">
                         {/* 
                            LAYER 1: Highlight / Rendering 
                            - Pointer events none so clicks go through to textarea
                            - z-0 to sit behind
                            - Text color is applied here
                         */}
                        <div 
                            ref={highlightRef}
                            className={`absolute inset-0 z-0 pointer-events-none ${SHARED_EDITOR_STYLES.typography} ${SHARED_EDITOR_STYLES.layout} ${SHARED_EDITOR_STYLES.smoothing}`}
                            aria-hidden="true"
                        >
                            {renderHighlightedText(promptContent)}
                            {/* Trailing newline handling ensures height matches textarea if user types enter at end */}
                            {promptContent.endsWith('\n') && <br />}
                        </div>
                        
                         {/* 
                            LAYER 2: Input / Textarea
                            - z-10 to sit in front
                            - Text transparent so Layer 1 shows through
                            - Caret color visible for typing experience
                            - No text shadow or blur
                         */}
                        <textarea 
                            ref={textareaRef}
                            value={promptContent}
                            onChange={(e) => setPromptContent(e.target.value)}
                            onScroll={handleScroll}
                            spellCheck="false"
                            className={`absolute inset-0 z-10 bg-transparent text-transparent caret-gray-900 dark:caret-white selection:bg-brand-lime/20 selection:text-transparent ${SHARED_EDITOR_STYLES.typography} ${SHARED_EDITOR_STYLES.layout} ${SHARED_EDITOR_STYLES.smoothing}`}
                        />
                    </div>
                </div>
            </div>

            {/* 3. Hyperparameters (Bottom Config) */}
            <div className="bg-gray-50 dark:bg-[#161b22] border-t border-gray-200 dark:border-white/10 p-6 space-y-6 z-10 transition-colors shrink-0">
                <div className="flex items-center gap-2 mb-2">
                    <Sliders size={16} className="text-brand-lime" />
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Hyperparameters</h4>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* Temperature */}
                    <div>
                        <div className="flex justify-between mb-3">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Temperature</label>
                            <span className="text-xs font-mono font-bold text-brand-lime bg-brand-lime/10 px-1.5 rounded">{temperature}</span>
                        </div>
                        <div className="relative h-6 flex items-center">
                             <input 
                                type="range" 
                                min="0" max="1" step="0.1" 
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="w-full bg-transparent appearance-none z-20 focus:outline-none focus:ring-2 focus:ring-brand-lime/50 rounded-full" 
                             />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-1">
                            <span>Precise</span>
                            <span>Creative</span>
                        </div>
                    </div>

                    {/* Top K */}
                    <div>
                        <div className="flex justify-between mb-3">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Top K</label>
                            <span className="text-xs font-mono font-bold text-brand-lime bg-brand-lime/10 px-1.5 rounded">{topK}</span>
                        </div>
                        <div className="relative h-6 flex items-center">
                             <input 
                                type="range" 
                                min="1" max="100" step="1" 
                                value={topK}
                                onChange={(e) => setTopK(parseInt(e.target.value))}
                                className="w-full bg-transparent appearance-none z-20 focus:outline-none focus:ring-2 focus:ring-brand-lime/50 rounded-full" 
                             />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-1">
                            <span>1</span>
                            <span>100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT PANEL: Live Preview (50%) --- */}
        <div className="w-1/2 flex flex-col bg-gray-50 dark:bg-[#0D1117] relative transition-colors duration-300">
            
            {/* 1. Preview Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Live Preview</h3>
                </div>
                
                {/* Compare Toggle */}
                <button 
                    onClick={() => setIsCompareMode(!isCompareMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                        isCompareMode 
                        ? 'bg-brand-lime/10 border-brand-lime text-brand-lime-dark dark:text-brand-lime' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-brand-lime/50'
                    }`}
                >
                    <FileDiff size={14} />
                    <span className="text-xs font-bold">Compare with v1.0</span>
                </button>
            </div>

            {/* 2. Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/50 dark:bg-[#0D1117] scroll-smooth">
                
                {/* Comparison Header Indicator */}
                {isCompareMode && (
                    <div className="flex gap-4 mb-4 sticky top-0 z-10">
                        <div className="w-1/2 text-center py-1 bg-brand-lime/10 border border-brand-lime/20 rounded text-[10px] font-bold text-brand-lime uppercase backdrop-blur-sm">
                            Current (v1.1)
                        </div>
                        <div className="w-1/2 text-center py-1 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-[10px] font-bold text-gray-500 uppercase backdrop-blur-sm">
                            Baseline (v1.0)
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {/* User Message */}
                        {msg.role === 'user' && (
                            <div className="bg-[#65A30D] text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm text-sm">
                                {msg.content}
                            </div>
                        )}

                        {/* Assistant Message */}
                        {msg.role === 'assistant' && (
                            <div className="w-full">
                                {isCompareMode ? (
                                    <div className="flex gap-4 w-full">
                                        {/* Current Version Bubble */}
                                        <div className="flex-1 bg-white dark:bg-gray-800/50 border border-brand-lime/30 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                                            <div className="text-xs font-bold text-brand-lime mb-2">v1.1</div>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{msg.content}</p>
                                        </div>
                                        
                                        {/* Baseline Version Bubble */}
                                        <div className="flex-1 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 px-5 py-4 rounded-2xl rounded-tr-sm shadow-sm opacity-80">
                                            <div className="text-xs font-bold text-gray-400 mb-2">v1.0</div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{SAMPLE_RESPONSE_V1}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3 max-w-[90%]">
                                        <div className="w-8 h-8 rounded-full bg-brand-lime-bg flex items-center justify-center flex-shrink-0 mt-1">
                                            <Bot size={16} className="text-brand-lime-dark" />
                                        </div>
                                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                                {msg.content}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 3. Footer Action Bar */}
            <div className="p-6 bg-white dark:bg-[#0D1117] border-t border-gray-200 dark:border-white/10 relative z-20 transition-colors">
                {/* Chat Input */}
                <div className="relative mb-4">
                    <input 
                        type="text" 
                        placeholder="Type a message to test..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-full pl-5 pr-12 py-3.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/50 transition-all shadow-inner"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-700 rounded-full text-brand-lime hover:scale-105 transition-transform shadow-sm">
                        <Play size={16} fill="currentColor" />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <RefreshCw size={14} />
                        Reset Session
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <button className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 backdrop-blur-md transition-all flex items-center gap-2 shadow-sm">
                            <Save size={16} />
                            Save Draft
                        </button>
                        <button className="px-8 py-3 rounded-2xl text-sm font-bold text-white bg-brand-lime hover:bg-brand-lime-dark transition-all shadow-[0_10px_20px_-5px_rgba(132,204,22,0.4)] hover:shadow-[0_10px_30px_-5px_rgba(132,204,22,0.6)] hover:scale-[1.02] flex items-center gap-2">
                            <Zap size={16} fill="currentColor" />
                            Deploy to Production
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default BotConfig;
