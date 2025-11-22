
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSidebar } from '../contexts/SidebarContext';
import { Moon, Sun, LayoutTemplate, Type, Radius, Palette, Check, PanelLeft, MousePointer, Eye, EyeOff } from 'lucide-react';

const ThemeStudio: React.FC = () => {
  const { 
    primaryColor, setPrimaryColor, 
    borderRadius, setBorderRadius, 
    fontFamily, setFontFamily,
    isDarkMode, toggleDarkMode 
  } = useTheme();

  const {
    defaultState, setDefaultState,
    interactionMode, setInteractionMode,
    showUserProfile, setShowUserProfile
  } = useSidebar();

  // Predefined brand colors
  const PRESET_COLORS = [
    '#84CC16', // Lime (Default)
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#F97316', // Orange
    '#10B981', // Emerald
  ];

  const FONTS = [
    'Plus Jakarta Sans',
    'Inter',
    'Roboto',
    'Space Mono',
  ];

  return (
    <div className="flex-1 h-full overflow-hidden flex gap-6 pb-4">
      {/* Controls Column */}
      <div className="w-[400px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-theme shadow-sm border border-white/40 dark:border-white/10 flex flex-col overflow-y-auto hide-scrollbar">
        <div className="p-6 border-b border-white/40 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Palette className="text-brand-lime" />
            Theme Studio
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Customize glassmorphism & colors.</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Mode Toggle */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Interface Mode</label>
            <div className="flex bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl">
              <button 
                onClick={() => !isDarkMode && toggleDarkMode()} 
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${isDarkMode ? 'text-gray-500' : 'bg-white shadow-sm text-gray-900'}`}
              >
                <Sun size={16} /> Light
              </button>
              <button 
                onClick={() => isDarkMode && toggleDarkMode()} 
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${!isDarkMode ? 'text-gray-500' : 'bg-gray-600 shadow-sm text-white'}`}
              >
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>

           {/* --- Navigation & Sidebar Settings --- */}
           <div className="border-t border-white/40 dark:border-white/10 pt-8">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <PanelLeft size={14} /> Navigation & Sidebar
              </label>
              
              <div className="space-y-4">
                 {/* Default State */}
                 <div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-2">Default State</span>
                    <div className="flex gap-2">
                       <button 
                          onClick={() => setDefaultState('expanded')}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                             defaultState === 'expanded' 
                             ? 'bg-brand-lime-bg text-brand-lime-dark border-brand-lime' 
                             : 'bg-white/50 dark:bg-gray-800/50 text-gray-500 border-gray-200 dark:border-gray-700'
                          }`}
                       >
                          Expanded
                       </button>
                       <button 
                          onClick={() => setDefaultState('collapsed')}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                             defaultState === 'collapsed' 
                             ? 'bg-brand-lime-bg text-brand-lime-dark border-brand-lime' 
                             : 'bg-white/50 dark:bg-gray-800/50 text-gray-500 border-gray-200 dark:border-gray-700'
                          }`}
                       >
                          Collapsed
                       </button>
                    </div>
                 </div>

                 {/* Interaction Mode */}
                 <div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-2">Interaction Mode</span>
                    <div className="space-y-2">
                       <div 
                          onClick={() => setInteractionMode('click')}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                             interactionMode === 'click' 
                             ? 'bg-white/80 dark:bg-gray-800 border-brand-lime shadow-sm' 
                             : 'bg-gray-50/50 dark:bg-gray-900/50 border-transparent hover:bg-white dark:hover:bg-gray-800'
                          }`}
                       >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${interactionMode === 'click' ? 'border-brand-lime bg-brand-lime' : 'border-gray-300'}`}>
                             {interactionMode === 'click' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-gray-900 dark:text-white">Click to Toggle</p>
                             <p className="text-[10px] text-gray-500">Standard behavior. Use the button.</p>
                          </div>
                       </div>

                       <div 
                          onClick={() => setInteractionMode('hover')}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                             interactionMode === 'hover' 
                             ? 'bg-white/80 dark:bg-gray-800 border-brand-lime shadow-sm' 
                             : 'bg-gray-50/50 dark:bg-gray-900/50 border-transparent hover:bg-white dark:hover:bg-gray-800'
                          }`}
                       >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${interactionMode === 'hover' ? 'border-brand-lime bg-brand-lime' : 'border-gray-300'}`}>
                             {interactionMode === 'hover' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-gray-900 dark:text-white">Hover to Expand</p>
                             <p className="text-[10px] text-gray-500">Smart expansion on mouse over.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

          {/* Color Scheme */}
          <div className="border-t border-white/40 dark:border-white/10 pt-8">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Primary Color</label>
            <div className="flex flex-wrap gap-3 mb-4">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-black/5"
                  style={{ backgroundColor: color }}
                >
                  {primaryColor.toLowerCase() === color.toLowerCase() && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
               <input 
                  type="color" 
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 p-1 rounded-lg border border-gray-200 cursor-pointer bg-white"
               />
               <span className="text-sm font-mono text-gray-600 dark:text-gray-300 uppercase">{primaryColor}</span>
            </div>
          </div>

          {/* Typography */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Type size={14} /> Typography
            </label>
            <div className="space-y-2">
              {FONTS.map((font) => (
                <div 
                  key={font}
                  onClick={() => setFontFamily(font)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                    fontFamily === font 
                    ? 'border-brand-lime bg-brand-lime-bg dark:bg-gray-800' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: font }}>{font}</span>
                  {fontFamily === font && <div className="w-2 h-2 rounded-full bg-brand-lime"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Column */}
      <div className="flex-1 flex flex-col gap-6">
         <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-theme p-8 shadow-lg border border-white/40 dark:border-white/10 flex items-center justify-center min-h-[300px] relative overflow-hidden">
            
            {/* Visual Gradient Mesh for Preview Context */}
            <div className="absolute inset-0 -z-10" style={{ 
                background: `radial-gradient(circle at 50% 120%, ${primaryColor}30 0%, transparent 50%), radial-gradient(circle at 0% 0%, ${primaryColor}20 0%, transparent 40%)` 
            }}></div>

            <div className="text-center max-w-md space-y-8 relative z-10">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-sm" style={{ fontFamily: fontFamily }}>
                   Glassmorphism Preview
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                   The interface uses a dynamic mesh gradient derived from your primary color combined with backdrop blur for a modern, depth-rich aesthetic.
                </p>
                
                <div className="flex flex-wrap justify-center gap-6">
                   <button className="bg-brand-lime text-white px-8 py-4 rounded-theme font-bold shadow-lg shadow-brand-lime/30 hover:scale-105 transition-transform border border-white/20">
                      Primary Action
                   </button>
                   <button className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md text-gray-900 dark:text-white px-8 py-4 rounded-theme font-bold hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors border border-white/20 dark:border-gray-600/30 shadow-sm">
                      Glass Action
                   </button>
                </div>

                {/* Glass Card Preview */}
                <div className="mt-8 p-6 bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-white/10 shadow-xl mx-auto max-w-xs">
                   <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-brand-lime rounded-full shadow-lg shadow-brand-lime/40"></div>
                      <div className="flex-1">
                          <div className="h-3 w-20 bg-gray-800/20 dark:bg-white/20 rounded-full mb-1.5"></div>
                          <div className="h-2 w-12 bg-gray-800/10 dark:bg-white/10 rounded-full"></div>
                      </div>
                   </div>
                   <div className="h-2 w-full bg-gray-800/10 dark:bg-white/5 rounded-full"></div>
                </div>
            </div>
         </div>

         <div className="flex-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-theme p-6 shadow-sm border border-white/40 dark:border-white/10">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Theme Configuration</h4>
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 font-mono text-xs text-gray-300 shadow-inner border border-gray-800">
               <p><span className="text-purple-400">const</span> theme = {'{'}</p>
               <p className="pl-4">style: <span className="text-green-300">'glassmorphism'</span>,</p>
               <p className="pl-4">gradient: <span className="text-brand-lime">`radial-gradient(${primaryColor})`</span>,</p>
               <p className="pl-4">backdrop: <span className="text-blue-300">'blur(24px)'</span>,</p>
               <p className="pl-4">radius: <span className="text-yellow-300">'{borderRadius}px'</span>,</p>
               <p className="pl-4">font: <span className="text-orange-300">'{fontFamily}'</span></p>
               <p>{'}'}</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ThemeStudio;
