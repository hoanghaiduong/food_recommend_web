
import React from 'react';
import { Search, Bell, Calendar, Download, Plus, Settings, MessageSquare, ChevronDown, RefreshCw, Save } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onSearchClick }) => {
  
  // --- Helper: Get Breadcrumbs ---
  const getBreadcrumbs = () => {
    const map: Record<string, string> = {
        dashboard: 'Overview',
        playground: 'AI Tools > Live Chat',
        knowledge: 'AI Engine > Knowledge Base',
        bot_config: 'AI Engine > Configuration',
        logs: 'System > Logs',
        settings: 'System > Settings',
        theme_studio: 'System > Theme Studio'
    };
    const path = map[currentView] || 'Dashboard';
    return (
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {path.split('>').map((crumb, i, arr) => (
                <React.Fragment key={i}>
                    <span className={`${i === arr.length - 1 ? 'text-gray-900 dark:text-white font-bold' : ''}`}>
                        {crumb.trim()}
                    </span>
                    {i !== arr.length - 1 && <span className="text-gray-300">/</span>}
                </React.Fragment>
            ))}
        </div>
    );
  };

  // --- Helper: Render Dynamic Actions ---
  const renderDynamicActions = () => {
      switch (currentView) {
          case 'dashboard':
              return (
                  <>
                    <div className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/40 dark:border-white/10 rounded-full px-4 py-2 cursor-pointer hover:border-brand-lime transition-colors shadow-sm">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Today: May 24</span>
                    </div>
                    <button className="p-2 bg-white/80 dark:bg-gray-800/80 border border-white/40 dark:border-white/10 rounded-full hover:bg-white dark:hover:bg-gray-700 text-gray-500 shadow-sm">
                        <RefreshCw size={18} />
                    </button>
                  </>
              );
          
          case 'playground':
              return (
                  <>
                    <button className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 border border-white/40 dark:border-white/10 px-4 py-2 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow-sm">
                        <MessageSquare size={16} className="text-brand-lime" />
                        <span>Chat Settings</span>
                    </button>
                  </>
              );

          case 'knowledge':
          case 'logs':
              return (
                  <>
                    <button className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 border border-white/40 dark:border-white/10 px-4 py-2 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow-sm">
                        <Download size={16} />
                        <span>Export CSV</span>
                    </button>
                    {currentView === 'knowledge' && (
                        <button className="flex items-center gap-2 bg-brand-lime text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-brand-lime-dark transition-colors shadow-md shadow-brand-lime/20">
                            <Plus size={16} />
                            <span>Add Document</span>
                        </button>
                    )}
                  </>
              );
            
          case 'settings': 
            return (
                <button className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-lg">
                    <Save size={16} />
                    <span>Save Changes</span>
                </button>
            );

          default:
              return null;
      }
  };

  return (
    <div className="flex flex-col gap-6 mb-2">
      <div className="flex items-center justify-between">
        
        {/* LEFT: Page Title / Breadcrumbs */}
        <div className="flex flex-col justify-center h-10">
            {getBreadcrumbs()}
        </div>

        {/* CENTER: Global Command Palette Trigger */}
        <button 
            onClick={onSearchClick}
            className="hidden md:flex items-center gap-3 w-96 bg-white/60 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800 transition-colors rounded-full px-4 py-2.5 group border border-white/40 dark:border-white/10 hover:border-brand-lime/50 dark:hover:border-gray-600 shadow-sm backdrop-blur-sm"
        >
            <Search size={18} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
            <span className="text-sm text-gray-400 font-medium">Search anything...</span>
            <div className="ml-auto flex items-center gap-1">
                <span className="text-[10px] font-bold text-gray-400 bg-white/80 dark:bg-gray-900 px-1.5 py-0.5 rounded border border-white/50 dark:border-gray-700">Ctrl K</span>
            </div>
        </button>

        {/* RIGHT: Dynamic Actions */}
        <div className="flex items-center gap-3">
           {renderDynamicActions()}
           
           {/* Notification Bell (Always Visible) */}
           <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>
           <button className="relative p-2 bg-white/80 dark:bg-gray-800/80 border border-white/40 dark:border-white/10 rounded-full hover:bg-white dark:hover:bg-gray-700 text-gray-500 transition-colors shadow-sm">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
