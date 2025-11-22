
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Calendar, 
  Download, 
  Plus, 
  Save, 
  MessageSquare, 
  RefreshCw, 
  Moon, 
  Sun,
  CheckCircle2,
  AlertTriangle,
  X,
  Clock
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  currentView: string;
  onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onSearchClick }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Mock Data for Popups ---
  const NOTIFICATIONS = [
    { id: 1, title: 'Model Training Complete', desc: 'Sales Assistant Alpha v3.4 is ready.', time: '2m ago', type: 'success' },
    { id: 2, title: 'High Latency Alert', desc: 'API response time > 2s on Node 4.', time: '1h ago', type: 'warning' },
    { id: 3, title: 'New Comment', desc: 'Brooklyn commented on "Data Prep".', time: '3h ago', type: 'info' },
  ];

  const EVENTS = [
    { id: 1, title: 'Team Sync', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Deploy v2.0', time: '02:00 PM', type: 'task' },
    { id: 3, title: 'Data Review', time: '04:30 PM', type: 'meeting' },
  ];

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
    <div className="flex flex-col gap-6 mb-2 relative z-50">
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

        {/* RIGHT: Dynamic Actions & Toggles */}
        <div className="flex items-center gap-3">
           {renderDynamicActions()}
           
           <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>

            {/* Theme Toggle */}
            <button 
                onClick={toggleDarkMode}
                className="p-2 bg-white/80 dark:bg-gray-800/80 border border-white/40 dark:border-white/10 rounded-full hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors shadow-sm"
            >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Calendar Dropdown */}
            <div className="relative" ref={calendarRef}>
                <div 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/40 dark:border-white/10 rounded-full px-4 py-2 cursor-pointer hover:border-brand-lime transition-colors shadow-sm select-none"
                >
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Today: May 24</span>
                </div>

                {/* Calendar Popup */}
                {showCalendar && (
                    <div className="absolute top-full right-0 mt-3 w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/40 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 z-50">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Schedule</h4>
                            <span className="text-[10px] font-bold text-brand-lime bg-brand-lime/10 px-2 py-0.5 rounded-full">May 24</span>
                        </div>
                        <div className="p-2">
                            {EVENTS.map((evt, i) => (
                                <div key={evt.id} className="flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer group">
                                    <div className={`flex flex-col items-center justify-center w-12 rounded-lg border ${
                                        i === 0 ? 'bg-brand-lime/10 border-brand-lime text-brand-lime-dark' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'
                                    }`}>
                                        <span className="text-[10px] font-bold">{evt.time.split(' ')[0]}</span>
                                        <span className="text-[8px] uppercase">{evt.time.split(' ')[1]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-lime-dark dark:group-hover:text-brand-lime transition-colors">{evt.title}</p>
                                        <p className="text-[10px] text-gray-500 capitalize">{evt.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-2 border-t border-gray-100 dark:border-gray-800 text-center">
                             <button className="text-xs font-bold text-gray-500 hover:text-brand-lime transition-colors w-full py-1">Open Calendar</button>
                        </div>
                    </div>
                )}
            </div>

           {/* Notification Bell Dropdown */}
           <div className="relative" ref={notificationRef}>
               <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-2 border rounded-full transition-colors shadow-sm ${
                        showNotifications 
                        ? 'bg-brand-lime text-white border-brand-lime' 
                        : 'bg-white/80 dark:bg-gray-800/80 border-white/40 dark:border-white/10 hover:bg-white dark:hover:bg-gray-700 text-gray-500'
                    }`}
                >
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
               </button>

               {/* Notifications Popup */}
               {showNotifications && (
                   <div className="absolute top-full right-0 mt-3 w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/40 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 z-50">
                       <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                           <h4 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h4>
                           <button className="text-[10px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Mark all read</button>
                       </div>
                       <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
                           {NOTIFICATIONS.map(notif => (
                               <div key={notif.id} className="p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex gap-3">
                                   <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                       notif.type === 'success' ? 'bg-brand-lime' : 
                                       notif.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                   }`}></div>
                                   <div>
                                       <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-0.5">{notif.title}</p>
                                       <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug mb-1.5">{notif.desc}</p>
                                       <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                           <Clock size={10} /> {notif.time}
                                       </span>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
