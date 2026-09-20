import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Theme, Translations, TRANSLATIONS } from './translations';

export type { Language, Theme, Translations };
export { TRANSLATIONS };

interface ThemeLanguageContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextProps | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Requirement: "by default light theme ."
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('phc_theme');
      if (saved === 'dark') return 'dark';
      if (saved === 'light') return 'light';
    } catch (e) {
      // ignore
    }
    // Strictly default to 'light' (never infer dark from system preference)
    return 'light';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('phc_language');
      if (saved === 'mr' || saved === 'en' || saved === 'hi' || saved === 'ta') {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('phc_theme', theme);
    } catch (e) {}

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('phc_language', language);
    } catch (e) {}
  }, [language]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (tVal: Theme) => {
    setThemeState(tVal);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        t
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = (): ThemeLanguageContextProps => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};
