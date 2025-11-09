import { useState, type ReactNode } from 'react';
import { Theme } from '@radix-ui/themes';
import { ThemeContext } from './theme-context';

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [appTheme, setAppTheme] = useState(true);

  // const [appearance, setAppearance] = useState<Appearance>('light');
  const [fade, setFade] = useState(false);

  const toggleAppearance = () => {
    setFade(true);
    setTimeout(() => {
      setAppTheme((prev) => (!prev));
      setFade(false);
    }, 500); // match fade timing
  };

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
       <div
          style={{
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            background:
              appTheme
                ? 'radial-gradient(circle at top right, #c2f0ff 0%, #e0f7fa 25%, #fdfdfd 80%)'
                : 'radial-gradient(circle at bottom right, #0a0f24 0%, #1b2735 40%, #2c5364 100%)',
            transition: 'background 1s ease-in-out, color 0.5s ease-in-out, opacity 0.5s ease',
            color: appTheme ? '#111' : '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            animation: 'gradientShift 14s ease-in-out infinite',
            backgroundSize: '300% 300%',
            opacity: fade ? 0 : 1
          }}
        >
          <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
          {children}
        </div>
      </Theme>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleAppearance}
        style={{
          position: 'fixed',
          bottom: '3rem',
          left: '0.251rem',
          padding: '0.6rem 1rem',
          borderRadius: '10px',
          background: appTheme ? '#2c5364' : '#e0f7fa',
          color: appTheme ? '#fff' : '#111',
          fontWeight: 600,
          border: 'none',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
      >
        {appTheme ? '🌙' : '☀️'}
      </button>
    </ThemeContext.Provider>
  );
}
