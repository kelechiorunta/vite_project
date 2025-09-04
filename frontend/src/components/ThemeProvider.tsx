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
      <Theme
        accentColor="mint"
        grayColor="gray"
        panelBackground="solid"
        scaling="100%"
        radius="full"
        appearance={!appTheme ? 'dark' : 'light'}
      >
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}
