
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  FileText, 
  LayoutGrid, 
  MessageSquare, 
  Settings, 
  Moon, 
  Sun, 
  Plus,
  CornerDownLeft,
  Hash
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSidebar } from '../contexts/SidebarContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentView: (view: string) => void;
}

type ResultType = 'PAGE' | 'FILE' | 'COMMAND';

interface SearchResult {
  id: string;
  type: ResultType;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  action: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, setCurrentView }) => {
  const { toggleDarkMode, isDarkMode } = useTheme();
  const { toggleSidebar } = useSidebar();
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (view: string) => {
    setCurrentView(view);
    onClose();
  };

  const DATA: SearchResult[] = [
    // Pages
    { id: 'p1', type: 'PAGE', icon: <LayoutGrid size={18} />, label: 'Dashboard', action: () => navigateTo('dashboard') },
    { id: 'p2', type: 'PAGE', icon: <MessageSquare size={18} />, label: 'Live Chat Playground', action: () => navigateTo('playground') },
    { id: 'p3', type: 'PAGE', icon: <Settings size={18} />, label: 'System Settings', action: () => navigateTo('settings') },
    
    // Files (Mock)
    { id: 'f1', type: 'FILE', icon: <FileText size={18} />, label: 'nutrition_facts_vietnam_2023.pdf', action: () => navigateTo('knowledge') },
    { id: 'f2', type: 'FILE', icon: <Hash size={18} />, label: 'gym_food_v2 (Vector Collection)', action: () => navigateTo('knowledge') },
    
    // Commands
    { id: 'c1', type: 'COMMAND', icon: isDarkMode ? <Sun size={18}/> : <Moon size={18}/>, label: 'Toggle Dark Mode', action: toggleDarkMode },
    { id: 'c2', type: 'COMMAND', icon: <Plus size={18}/>, label: 'Create New Task', shortcut: 'C', action: () => { console.log('New Task'); onClose(); } },
  ];

  const filteredData = DATA.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = {
    PAGE: filteredData.filter(i => i.type === 'PAGE'),
    FILE: filteredData.filter(i => i.type === 'FILE'),
    COMMAND: filteredData.filter(i => i.type === 'COMMAND'),
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden flex flex-col max-h-[60vh] animate-[fadeIn_0.1s_ease-out]">
        
        {/* Header / Input */}
        <div className="flex items-center px-4 py-4 border-b border-white/40 dark:border-white/10">
          <Search className="text-gray-400 w-5 h-5 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, files, or commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
          <div className="hidden md:flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
            <span className="text-[10px]">ESC</span>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2 scroll-smooth">
          {filteredData.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              No results found for "{search}"
            </div>
          )}

          {Object.entries(grouped).map(([type, items]) => (
            items.length > 0 && (
              <div key={type} className="mb-4">
                <h4 className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {type === 'PAGE' ? 'Navigation' : type === 'FILE' ? 'Recent Files' : 'Commands'}
                </h4>
                <div className="space-y-1">
                  {items.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                            type === 'COMMAND' ? 'bg-brand-lime-bg text-brand-lime-dark' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
                        }`}>
                          {item.icon}
                        </div>
                        <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                          {item.label}
                        </span>
                      </div>
                      {item.shortcut && (
                        <span className="text-xs font-mono text-gray-400">{item.shortcut}</span>
                      )}
                      {type === 'COMMAND' && !item.shortcut && (
                         <CornerDownLeft size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50/50 dark:bg-gray-800/50 border-t border-white/40 dark:border-white/10 text-[10px] text-gray-500 flex justify-between">
           <div className="flex gap-3">
             <span><strong className="font-bold">↑↓</strong> to navigate</span>
             <span><strong className="font-bold">↵</strong> to select</span>
           </div>
           <span>Weihu OS v2.4</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
