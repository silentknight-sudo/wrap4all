
'use client';

import * as React from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

type Theme = 'Cyber-Neon' | 'Minimalist' | 'Retro';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const firestore = useFirestore();
  const [theme, setThemeState] = React.useState<Theme>('Cyber-Neon');

  React.useEffect(() => {
    if (!firestore) return;
    
    // Listen to firestore for global theme changes
    const unsub = onSnapshot(doc(firestore, 'settings', 'appearance'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.activeTheme) {
          setThemeState(data.activeTheme as Theme);
        }
      }
    });

    return () => unsub();
  }, [firestore]);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-minimalist', 'theme-retro');
    
    if (theme === 'Minimalist') {
      root.classList.add('theme-minimalist');
    } else if (theme === 'Retro') {
      root.classList.add('theme-retro');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
