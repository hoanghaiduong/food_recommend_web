
import React, { useState, useRef } from 'react';
import { 
  LayoutGrid, 
  MessageSquare, 
  Database, 
  Cpu, 
  ClipboardList, 
  Palette, 
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

interface TooltipState {
  label: string;
  top: number;
  left: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { primaryColor } = useTheme();
  const { 
    isCollapsed, 
    toggleSidebar, 
    interactionMode, 
    handleMouseEnter, 
    handleMouseLeave,
    showUserProfile
  } = useSidebar();
  const { logout } = useAuth();

  const [hoveredItem, setHoveredItem] = useState<TooltipState | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle Tooltip Positioning
  const onHoverItem = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>, label: string) => {
    if (!isCollapsed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredItem({
      label,
      top: rect.top + (rect.height / 2), // Center vertically
      left: rect.right + 12 // 12px offset to the right
    });
  };

  const onLeaveItem = () => {
    setHoveredItem(null);
  };

  // Menu Configuration
  const MENU_SECTIONS = [
    {
      label: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
        { id: 'playground', label: 'Live Chat / Playground', icon: MessageSquare },
      ]
    },
    {
      label: 'AI ENGINE',
      items: [
        { id: 'knowledge', label: 'Knowledge Base', icon: Database },
        { id: 'bot_config', label: 'Bot Configuration', icon: Cpu },
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { id: 'logs', label: 'Logs & History', icon: ClipboardList },
        { id: 'theme_studio', label: 'Theme Studio', icon: Palette },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      <div 
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          relative h-full flex flex-col flex-shrink-0 
          bg-white/80 dark:bg-[#111827]/90 backdrop-blur-xl
          border-r border-white/40 dark:border-white/10
          transition-all duration-300 ease-in-out z-40
          ${isCollapsed ? 'w-20' : 'w-[280px]'}
        `}
      >
        {/* Toggle Button - Floating on Right Border */}
        {interactionMode === 'click' && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-9 z-50 w-7 h-7 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/40 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-lime hover:border-brand-lime transition-all shadow-md hover:shadow-lg hover:scale-110"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        {/* Inner Scrollable Container */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar p-4">
          
          {/* Logo */}
          <div className={`flex items-center mb-10 flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3 px-2'}`}>
            <div className="w-10 h-10 bg-brand-lime rounded-theme flex items-center justify-center shadow-lg flex-shrink-0" style={{ boxShadow: `0 10px 20px -5px ${primaryColor}50` }}>
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
               <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap">weihu</span>
            </div>
          </div>

          {/* Menu Sections */}
          <div className="flex-1 space-y-2">
            {MENU_SECTIONS.map((section, idx) => (
              <div key={section.label} className="mb-4">
                {/* Section Separator & Label */}
                <div className={`mb-3 transition-all duration-300 ${idx !== 0 ? 'pt-4 border-t border-white/20 dark:border-gray-700/30' : ''}`}>
                  <h4 className={`text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider transition-all duration-300 ${isCollapsed ? 'text-center opacity-0 h-0 overflow-hidden' : 'px-3 opacity-100'}`}>
                     {section.label}
                  </h4>
                  {/* Divider line for collapsed mode if not first item */}
                  {isCollapsed && idx !== 0 && <div className="w-8 mx-auto h-px bg-white/20 dark:bg-gray-700/30 my-2"></div>}
                </div>
                
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = currentView === item.id;
                    const Icon = item.icon;
                    
                    return (
                      <div 
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        onMouseEnter={(e) => onHoverItem(e, item.label)}
                        onMouseLeave={onLeaveItem}
                        style={{
                           // Apply dynamic border color for active state
                           borderColor: isActive ? `${primaryColor}60` : 'transparent'
                        }}
                        className={`
                          group relative flex items-center rounded-xl cursor-pointer transition-all duration-200 border
                          ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-3'}
                          ${isActive 
                            ? 'bg-brand-lime-bg dark:bg-brand-lime/10 text-brand-lime-dark dark:text-brand-lime font-bold shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white font-medium border-transparent'
                          }
                        `}
                      >
                        {/* Icon */}
                        <div className={`flex-shrink-0 transition-colors relative z-10 ${isActive ? 'text-brand-lime-dark dark:text-brand-lime' : 'text-current'}`}>
                           <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        </div>

                        {/* Label (Expanded Only) */}
                        <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* User Profile & Logout (Footer) */}
          {showUserProfile && (
            <div className="mt-6 flex flex-col gap-2">
              <div 
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm flex items-center cursor-pointer hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all flex-shrink-0 border border-white/50 dark:border-gray-700/40 group ${isCollapsed ? 'justify-center p-2 aspect-square' : 'justify-between p-3'}`}
                onMouseEnter={(e) => onHoverItem(e, "User Profile")}
                onMouseLeave={onLeaveItem}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img 
                    src="https://picsum.photos/id/65/100/100" 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white dark:border-gray-700"
                  />
                  
                  <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate">Brooklyn S.</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">simmons@gamil.com</span>
                  </div>
                </div>
                
                {!isCollapsed && <ChevronRight size={16} className="text-gray-400 flex-shrink-0 group-hover:text-brand-lime transition-colors" />}
              </div>

              {/* Logout Button */}
              <button 
                onClick={logout}
                className={`
                  group flex items-center rounded-xl cursor-pointer transition-all duration-200 border border-transparent
                  ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-3'}
                  text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-100 dark:hover:border-red-900/30
                `}
                title="Sign Out"
                onMouseEnter={(e) => onHoverItem(e, "Sign Out")}
                onMouseLeave={onLeaveItem}
              >
                  <div className="flex-shrink-0">
                     <LogOut size={20} />
                  </div>
                  <span className={`font-bold whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
                     Log Out
                  </span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Floating Tooltip (Fixed Position to avoid clipping) */}
      {isCollapsed && hoveredItem && (
        <div 
          className="fixed z-[100] flex items-center animate-[fadeIn_0.2s_ease-in-out]"
          style={{ 
            top: hoveredItem.top, 
            left: hoveredItem.left,
            transform: 'translateY(-50%)' 
          }}
        >
          {/* Arrow */}
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-r-[6px] border-r-gray-900/90 border-b-[5px] border-b-transparent -mr-[1px]"></div>
          
          {/* Content */}
          <div className="bg-gray-900/90 backdrop-blur-md text-white text-xs font-medium py-1.5 px-3 rounded-md shadow-xl border border-white/10 whitespace-nowrap">
            {hoveredItem.label}
          </div>
          
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-50%) scale(0.95) translateX(-5px); }
              to { opacity: 1; transform: translateY(-50%) scale(1) translateX(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Sidebar;
