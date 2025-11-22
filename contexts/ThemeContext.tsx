
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to lighten/darken colors (simple implementation for demo)
const adjustColor = (color: string, amount: number) => {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState('#84CC16'); // Default Lime
  const [borderRadius, setBorderRadius] = useState(24); // Default ~1.5rem
  const [fontFamily, setFontFamily] = useState('Plus Jakarta Sans');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply variables to :root
  useEffect(() => {
    const root = document.documentElement;
    
    // Update CSS Variables
    root.style.setProperty('--primary', primaryColor);
    
    // Simple darken/lighten logic for variants
    // In a real app, use a library like tinycolor2
    // This is a rough approximation for demo purposes or simply rely on opacity
    root.style.setProperty('--primary-dark', adjustColor(primaryColor, -40)); 
    
    // For light/bg variants, we usually use opacity in Tailwind, 
    // but here we can set a specific very light version
    // Note: This simple hex math is imperfect but works for visual demo
    root.style.setProperty('--primary-bg', `${primaryColor}15`); // 15 = approx 10% opacity hex
    root.style.setProperty('--primary-light', `${primaryColor}30`); // 30 = approx 20% opacity hex

    root.style.setProperty('--radius', `${borderRadius}px`);
    root.style.setProperty('--font-body', fontFamily);

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

  }, [primaryColor, borderRadius, fontFamily, isDarkMode]);

  return (
    <ThemeContext.Provider value={{
      primaryColor,
      setPrimaryColor,
      borderRadius,
      setBorderRadius,
      fontFamily,
      setFontFamily,
      isDarkMode,
      toggleDarkMode: () => setIsDarkMode(prev => !prev)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
