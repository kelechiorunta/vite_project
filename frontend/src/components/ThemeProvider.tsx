import { useState, type ReactNode } from 'react';
import { Theme } from '@radix-ui/themes';
import { ThemeContext } from './theme-context';

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [appTheme, setAppTheme] = useState(true);

  return (
    <ThemeContext.Provider value={{ appTheme, toggleTheme: setAppTheme }}>
      <Theme appearance={appTheme ? 'dark' : 'light'}>{children}</Theme>
    </ThemeContext.Provider>
  );
}
