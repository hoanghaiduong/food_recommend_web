
import React, { createContext, useContext, useState, useEffect } from 'react';

type InteractionMode = 'click' | 'hover';
type DefaultState = 'expanded' | 'collapsed';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
  
  // Settings
  defaultState: DefaultState;
  setDefaultState: (state: DefaultState) => void;
  interactionMode: InteractionMode;
  setInteractionMode: (mode: InteractionMode) => void;
  showUserProfile: boolean;
  setShowUserProfile: (show: boolean) => void;
  
  // Handlers for Hover Mode
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Settings State (Persisted)
  const [defaultState, setDefaultState] = useState<DefaultState>(() => {
    return (localStorage.getItem('sidebar_default_state') as DefaultState) || 'expanded';
  });
  
  const [interactionMode, setInteractionMode] = useState<InteractionMode>(() => {
    return (localStorage.getItem('sidebar_interaction_mode') as InteractionMode) || 'click';
  });

  const [showUserProfile, setShowUserProfile] = useState<boolean>(true);

  // Active State
  const [isCollapsed, setIsCollapsed] = useState(defaultState === 'collapsed');

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('sidebar_default_state', defaultState);
  }, [defaultState]);

  useEffect(() => {
    localStorage.setItem('sidebar_interaction_mode', interactionMode);
    // If switching to hover, force collapse initially
    if (interactionMode === 'hover') {
      setIsCollapsed(true);
    } else {
      // If switching back to click, revert to default preference
      setIsCollapsed(defaultState === 'collapsed');
    }
  }, [interactionMode, defaultState]);

  const toggleSidebar = () => {
    if (interactionMode === 'click') {
      setIsCollapsed(prev => !prev);
    }
  };

  const handleMouseEnter = () => {
    if (interactionMode === 'hover') {
      setIsCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (interactionMode === 'hover') {
      setIsCollapsed(true);
    }
  };

  return (
    <SidebarContext.Provider value={{
      isCollapsed,
      setIsCollapsed,
      toggleSidebar,
      defaultState,
      setDefaultState,
      interactionMode,
      setInteractionMode,
      showUserProfile,
      setShowUserProfile,
      handleMouseEnter,
      handleMouseLeave
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
