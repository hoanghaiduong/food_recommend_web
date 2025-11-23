
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import KnowledgeBase from './components/KnowledgeBase';
import BotConfig from './components/BotConfig';
import ThemeStudio from './components/ThemeStudio';
import SystemLogs from './components/SystemLogs';
import LiveChatPlayground from './components/LiveChatPlayground';
import SystemSettings from './components/SystemSettings';
import CommandPalette from './components/CommandPalette';
import SetupGuard from './components/SetupGuard';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const { primaryColor, isDarkMode } = useTheme();

  // Keyboard Shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dynamic Mesh Gradient Style (Center Focused)
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#0f1115' : '#F9FAFB',
    backgroundImage: isDarkMode 
      ? `radial-gradient(circle at 50% 50%, ${primaryColor}15 0%, ${primaryColor}05 30%, transparent 60%)`
      : `radial-gradient(circle at 50% 50%, ${primaryColor}25 0%, ${primaryColor}05 25%, transparent 60%)`,
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover'
  };

  // Special layout for Playground
  if (currentView === 'playground') {
      return (
        <div className="flex h-screen w-full font-sans text-primary dark:text-white overflow-hidden transition-colors duration-500" style={backgroundStyle}>
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            <div className="flex-1 h-full overflow-hidden">
                <LiveChatPlayground />
            </div>
            <CommandPalette 
                isOpen={isPaletteOpen} 
                onClose={() => setIsPaletteOpen(false)} 
                setCurrentView={setCurrentView} 
            />
        </div>
      );
  }

  return (
    <div className="flex h-screen w-full font-sans text-primary dark:text-white overflow-hidden transition-colors duration-500" style={backgroundStyle}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 flex flex-col h-full p-6 pl-0 overflow-hidden relative">
        {/* Inner container for right side content */}
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 flex-shrink-0">
                <Header 
                  currentView={currentView} 
                  onSearchClick={() => setIsPaletteOpen(true)}
                />
            </div>
            
            <div className="flex-1 px-6 overflow-hidden pb-2 flex flex-col min-h-0">
                {currentView === 'dashboard' && <DashboardStats />}
                {currentView === 'knowledge' && <KnowledgeBase />}
                {currentView === 'bot_config' && <BotConfig />}
                {currentView === 'theme_studio' && <ThemeStudio />}
                {currentView === 'logs' && <SystemLogs />}
                {currentView === 'settings' && <SystemSettings />}
            </div>
        </div>

        <CommandPalette 
            isOpen={isPaletteOpen} 
            onClose={() => setIsPaletteOpen(false)} 
            setCurrentView={setCurrentView} 
        />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <SetupGuard>
            <AppContent />
        </SetupGuard>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default App;
