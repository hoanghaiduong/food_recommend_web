
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  Paperclip, 
  Settings, 
  PanelRightClose, 
  PanelRightOpen, 
  PanelLeftClose, 
  PanelLeftOpen,
  Plus,
  MessageSquare,
  Edit2,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Code,
  FileText,
  Activity,
  ChevronDown,
  Search
} from 'lucide-react';

// --- Mock Data ---

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  dateGroup: 'Today' | 'Yesterday' | 'Previous 30 Days';
}

const MOCK_SESSIONS: ChatSession[] = [
  { id: '1', title: 'Calories in Pho Bo', dateGroup: 'Today' },
  { id: '2', title: 'Macro calc for bulking', dateGroup: 'Today' },
  { id: '3', title: 'Python script error fix', dateGroup: 'Yesterday' },
  { id: '4', title: 'Explain Quantum Computing', dateGroup: 'Previous 30 Days' },
  { id: '5', title: 'Gym workout plan 4 days', dateGroup: 'Previous 30 Days' },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'How many calories are in a standard bowl of Pho Bo (Beef Pho)?',
    timestamp: '10:30 AM'
  },
  {
    id: 'm2',
    role: 'assistant',
    content: `A standard bowl of **Pho Bo (Beef Pho)** typically contains between **350 to 450 calories**. \n\nHere is the approximate breakdown based on a 600g serving:\n\n*   **Carbs:** 60g (Rice noodles)\n*   **Protein:** 25g (Beef slices)\n*   **Fat:** 10-12g (Broth marrow & oil)\n\nIf you add extra fatty brisket or oil, it can go up to **600+ calories**.`,
    timestamp: '10:30 AM'
  }
];

const RAG_CONTEXT_MOCK = [
  {
    id: 'doc_1',
    source: 'nutrition_facts_vietnam_2023.pdf',
    content: '...traditional Pho Bo consists of broth made from beef bones, charred ginger, onions, and spices. A medium bowl (approx 500-600g) averages 350-450 kcals...',
    similarity: 0.92
  },
  {
    id: 'doc_2',
    source: 'street_food_calories.json',
    content: '{"item": "Pho Bo Tai", "avg_calories": 400, "protein": "28g", "serving_size": "Bowl"}',
    similarity: 0.88
  },
  {
    id: 'doc_3',
    source: 'gym_macro_guidelines.txt',
    content: '...for cutting phases, avoid drinking all the broth in noodle soups like Pho to save approx 50-80 calories from fat...',
    similarity: 0.75
  }
];

const JSON_DEBUG_MOCK = {
  model: "gemini-1.5-pro",
  usage: {
    prompt_tokens: 245,
    completion_tokens: 120,
    total_tokens: 365
  },
  latency: "1.2s",
  finish_reason: "stop",
  system_fingerprint: "fp_8823x9",
  search_grounding: {
    enabled: true,
    queries: ["calories in pho bo"]
  }
};

// --- Components ---

const LiveChatPlayground: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'CONTEXT' | 'JSON'>('CONTEXT');
  const [selectedModel, setSelectedModel] = useState('Gemini 1.5 Pro');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
  const toggleInspector = () => setIsInspectorOpen(!isInspectorOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simulate bot typing
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a simulated response for demonstration purposes.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter sessions based on search query
  const filteredSessions = MOCK_SESSIONS.filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render Markdown content (Simple implementation)
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold
      const boldParts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={i} className={`min-h-[1.2em] ${line.startsWith('* ') ? 'pl-4 relative before:content-["•"] before:absolute before:left-0 before:text-gray-400 dark:before:text-gray-500' : ''}`}>
          {boldParts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-bold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex h-full overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* --- LEFT SIDEBAR (History) --- */}
      <div className={`${isLeftSidebarOpen ? 'w-[260px]' : 'w-0'} bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col overflow-hidden flex-shrink-0 relative`}>
        
        {/* New Chat Button */}
        <div className="p-4 pb-2">
          <button className="w-full flex items-center gap-2 px-3 py-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-lime hover:bg-white dark:hover:bg-gray-900 transition-all text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white group">
            <Plus size={16} className="group-hover:text-brand-lime" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/50 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/50 transition-all placeholder-gray-400 dark:placeholder-gray-600"
                />
            </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-6 hide-scrollbar mt-2">
          {['Today', 'Yesterday', 'Previous 30 Days'].map((group) => {
             const sessionsInGroup = filteredSessions.filter(s => s.dateGroup === group);
             
             if (sessionsInGroup.length === 0) return null;

             return (
               <div key={group}>
                 <h4 className="px-3 text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">{group}</h4>
                 <div className="space-y-1">
                   {sessionsInGroup.map(session => (
                     <div key={session.id} className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800 cursor-pointer transition-colors text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative">
                       <MessageSquare size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-brand-lime transition-colors flex-shrink-0" />
                       <span className="truncate flex-1">{session.title}</span>
                       
                       {/* Hover Actions */}
                       <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-gray-200 dark:bg-gray-800 pl-2 shadow-sm rounded-md">
                         <button className="p-1 hover:text-brand-lime"><Edit2 size={12} /></button>
                         <button className="p-1 hover:text-red-400"><Trash2 size={12} /></button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             );
          })}
          
          {/* Empty State for Search */}
          {filteredSessions.length === 0 && searchQuery && (
              <div className="text-center p-4">
                  <p className="text-xs text-gray-400 dark:text-gray-600">No chats found matching "{searchQuery}"</p>
              </div>
          )}
        </div>

        {/* Footer User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/50 dark:hover:bg-gray-900 cursor-pointer transition-colors">
            <img src="https://picsum.photos/id/65/100/100" className="w-8 h-8 rounded-full" alt="User" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Brooklyn S.</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Pro Plan</p>
            </div>
            <Settings size={16} className="text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>


      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-gray-900 min-w-0 transition-colors">
        
        {/* Top Bar (Sticky) */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 sticky top-0 transition-colors">
          <div className="flex items-center gap-3">
             <button onClick={toggleLeftSidebar} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
               {isLeftSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
             </button>
             <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors">
                   {selectedModel}
                   <ChevronDown size={14} className="text-gray-500" />
                </button>
                {/* Dropdown */}
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                   {['Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'GPT-4o', 'Llama 3 70B'].map(m => (
                     <div key={m} onClick={() => setSelectedModel(m)} className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white cursor-pointer first:rounded-t-xl last:rounded-b-xl">
                       {m}
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
               <Settings size={20} />
             </button>
             <button 
                onClick={toggleInspector}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isInspectorOpen ? 'bg-gray-100 dark:bg-gray-800 text-brand-lime-dark dark:text-brand-lime' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
             >
               {isInspectorOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
             </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth hide-scrollbar">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex gap-4 md:gap-6 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
               
               {/* Avatar */}
               <div className="flex-shrink-0 mt-1">
                 {msg.role === 'assistant' ? (
                   <div className="w-8 h-8 rounded-full bg-brand-lime-bg flex items-center justify-center">
                     <div className="w-4 h-4 bg-brand-lime rounded-sm"></div>
                   </div>
                 ) : (
                   <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                      <img src="https://picsum.photos/id/65/100/100" alt="User" />
                   </div>
                 )}
               </div>

               {/* Message Content */}
               <div className={`flex flex-col max-w-[80%] md:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                 <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{msg.role === 'assistant' ? 'Weihu Bot' : 'You'}</span>
                 </div>
                 
                 <div className={`
                    rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-[#65A30D] text-white rounded-tr-sm' 
                      : 'bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-200 dark:border-gray-800' 
                    }
                 `}>
                    {renderContent(msg.content)}
                 </div>

                 {/* Bot Actions */}
                 {msg.role === 'assistant' && (
                   <div className="flex items-center gap-1 mt-2 pl-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                     <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Copy">
                       <Copy size={14} />
                     </button>
                     <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Regenerate">
                       <RefreshCw size={14} />
                     </button>
                     <div className="h-3 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>
                     <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-brand-lime rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                       <ThumbsUp size={14} />
                     </button>
                     <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                       <ThumbsDown size={14} />
                     </button>
                   </div>
                 )}
               </div>
             </div>
           ))}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Sticky Bottom) */}
        <div className="p-4 md:p-6 bg-white dark:bg-gray-900 z-20 transition-colors">
           <div className="max-w-3xl mx-auto relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message Weihu Bot..." 
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-full py-4 pl-12 pr-14 focus:outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/50 transition-all shadow-sm border border-gray-200 dark:border-gray-700/50"
              />
              
              {/* Left Icons */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pl-2">
                 <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Paperclip size={18} />
                 </button>
              </div>

              {/* Right Buttons */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-1">
                 {!input && (
                   <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                      <Mic size={18} />
                   </button>
                 )}
                 <button 
                    onClick={handleSend}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      input.trim() 
                      ? 'bg-brand-lime text-white font-bold hover:scale-105 shadow-lg shadow-brand-lime/20' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                 >
                    <Send size={18} strokeWidth={2.5} />
                 </button>
              </div>
           </div>
           <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-3">
              AI can make mistakes. Consider checking important information.
           </p>
        </div>
      </div>


      {/* --- RIGHT SIDEBAR (Inspector) --- */}
      <div className={`${isInspectorOpen ? 'w-[360px]' : 'w-0'} bg-gray-50 dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col overflow-hidden flex-shrink-0`}>
        
        {/* Inspector Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 gap-2">
           <Activity size={18} className="text-brand-lime" />
           <span className="font-bold text-gray-900 dark:text-white tracking-tight">Inspector Mode</span>
           <span className="ml-auto text-[10px] font-bold bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded border border-gray-300 dark:border-gray-700">DEBUG</span>
        </div>

        {/* Tabs */}
        <div className="flex p-1 mx-4 mt-4 bg-gray-200/50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
           <button 
              onClick={() => setInspectorTab('CONTEXT')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${inspectorTab === 'CONTEXT' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
           >
              RAG Context
           </button>
           <button 
              onClick={() => setInspectorTab('JSON')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${inspectorTab === 'JSON' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
           >
              Raw JSON
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           
           {/* --- CONTEXT TAB --- */}
           {inspectorTab === 'CONTEXT' && (
             <>
               <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 px-1">
                  <span>Retrieved Chunks</span>
                  <span>3 documents</span>
               </div>
               {RAG_CONTEXT_MOCK.map((doc) => (
                 <div key={doc.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors group shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                          <FileText size={14} className="text-blue-500 dark:text-blue-400" />
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{doc.source}</span>
                       </div>
                       <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded font-mono">ID: {doc.id}</span>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-3 group-hover:line-clamp-none transition-all">
                       "{doc.content}"
                    </p>

                    <div className="space-y-1">
                       <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-gray-500">Similarity Score</span>
                          <span className="text-brand-lime-dark dark:text-brand-lime">{doc.similarity * 100}%</span>
                       </div>
                       <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-lime" style={{ width: `${doc.similarity * 100}%` }}></div>
                       </div>
                    </div>
                    
                    <button className="w-full mt-3 py-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 rounded hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-gray-800">
                       View Source File
                    </button>
                 </div>
               ))}
             </>
           )}

           {/* --- JSON TAB --- */}
           {inspectorTab === 'JSON' && (
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Latency</span>
                      <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">{JSON_DEBUG_MOCK.latency}</span>
                   </div>
                   <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Total Tokens</span>
                      <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">{JSON_DEBUG_MOCK.usage.total_tokens}</span>
                   </div>
                </div>

                <div className="bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                   <div className="flex items-center justify-between px-3 py-2 bg-gray-800/50 border-b border-gray-800">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                         <Code size={12} />
                         <span className="font-mono">response.json</span>
                      </div>
                      <button className="text-gray-500 hover:text-white"><Copy size={12} /></button>
                   </div>
                   <div className="p-3 overflow-x-auto">
                      <pre className="text-[10px] font-mono text-green-400 leading-4">
                         {JSON.stringify(JSON_DEBUG_MOCK, null, 2)}
                      </pre>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>

    </div>
  );
};

export default LiveChatPlayground;
