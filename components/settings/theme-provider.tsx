'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { themes, type Theme } from '@/lib/themes';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type FontSize = 'sm' | 'md' | 'lg';

interface ThemeProviderState {
  theme: Theme;
  setTheme: (themeName: string) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  themes: Theme[];
  farmName: string;
  setFarmName: (name: string) => void;
  loginImageUrl: string;
  setLoginImageUrl: (url: string) => void;
  farmMapUrl: string;
  setFarmMapUrl: (url: string) => void;
}

const loginImageDefault = PlaceHolderImages.find((p) => p.id === 'login-cow');
const farmMapImageDefault = PlaceHolderImages.find((p) => p.id === 'farm-map');

const initialState: ThemeProviderState = {
  theme: themes[0],
  setTheme: () => null,
  fontSize: 'md',
  setFontSize: () => null,
  themes,
  farmName: 'AGUA LINDA',
  setFarmName: () => null,
  loginImageUrl: loginImageDefault?.imageUrl || '',
  setLoginImageUrl: () => null,
  farmMapUrl: farmMapImageDefault?.imageUrl || '',
  setFarmMapUrl: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);


export function ThemeProvider({
  children,
  defaultTheme = 'agua-linda',
  defaultFontSize = 'md',
  defaultFarmName = 'AGUA LINDA',
  storageKey = 'agua-linda-ui-settings',
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  defaultFontSize?: FontSize;
  defaultFarmName?: string;
  storageKey?: string;
}) {
  const [themeName, setThemeName] = useState<string>(defaultTheme);
  const [fontSize, setFontSizeState] = useState<FontSize>(defaultFontSize);
  const [farmName, setFarmNameState] = useState<string>(defaultFarmName);
  const [loginImageUrl, setLoginImageUrlState] = useState<string>(loginImageDefault?.imageUrl || '');
  const [farmMapUrl, setFarmMapUrlState] = useState<string>(farmMapImageDefault?.imageUrl || '');
  
  useEffect(() => {
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem(`${storageKey}-theme`) : defaultTheme;
    const storedFontSize = (typeof window !== 'undefined' ? localStorage.getItem(`${storageKey}-font-size`) : defaultFontSize) as FontSize;
    const storedFarmName = typeof window !== 'undefined' ? localStorage.getItem(`${storageKey}-farm-name`) : defaultFarmName;
    const storedLoginImageUrl = typeof window !== 'undefined' ? localStorage.getItem(`${storageKey}-login-image`) : (loginImageDefault?.imageUrl || '');
    const storedFarmMapUrl = typeof window !== 'undefined' ? localStorage.getItem(`${storageKey}-farm-map`) : (farmMapImageDefault?.imageUrl || '');

    
    if (storedTheme && themes.find(t => t.name === storedTheme)) {
      setThemeName(storedTheme);
    }
    
    if (storedFontSize && ['sm', 'md', 'lg'].includes(storedFontSize)) {
      setFontSizeState(storedFontSize);
    }
    
    if (storedFarmName) {
      setFarmNameState(storedFarmName);
    }
    
    if (storedLoginImageUrl) {
        setLoginImageUrlState(storedLoginImageUrl);
    }
    
    if (storedFarmMapUrl) {
      setFarmMapUrlState(storedFarmMapUrl);
    }

  }, [storageKey, defaultTheme, defaultFontSize, defaultFarmName]);

  const theme = useMemo(() => themes.find((t) => t.name === themeName) || themes[0], [themeName]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    Object.entries(theme.colors).forEach(([name, color]) => {
        const cssVarName = `--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, color);
    });

    localStorage.setItem(`${storageKey}-theme`, theme.name);

  }, [theme, storageKey]);

  const setFontSize = (size: FontSize) => {
    const root = window.document.documentElement;
    root.style.fontSize = 
        size === 'sm' ? '14px' :
        size === 'lg' ? '18px' :
        '16px'; // md
    localStorage.setItem(`${storageKey}-font-size`, size);
    setFontSizeState(size);
  }

  const setFarmName = (name: string) => {
    localStorage.setItem(`${storageKey}-farm-name`, name);
    setFarmNameState(name);
  }

  const setLoginImageUrl = (url: string) => {
    localStorage.setItem(`${storageKey}-login-image`, url);
    setLoginImageUrlState(url);
  }

  const setFarmMapUrl = (url: string) => {
    localStorage.setItem(`${storageKey}-farm-map`, url);
    setFarmMapUrlState(url);
  }


  const value = {
    theme,
    setTheme: (newThemeName: string) => {
        setThemeName(newThemeName);
    },
    fontSize,
    setFontSize,
    themes,
    farmName,
    setFarmName,
    loginImageUrl,
    setLoginImageUrl,
    farmMapUrl,
    setFarmMapUrl,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
