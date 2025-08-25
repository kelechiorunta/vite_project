import { createContext, useContext } from 'react';

export type ThemeContextType = {
  appTheme: boolean;
  toggleTheme: (value: boolean) => void;
};

// Context with default undefined
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
}
