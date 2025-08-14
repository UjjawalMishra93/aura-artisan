// Theme switching removed. App runs with a fixed dark theme via CSS variables.
import { Fragment } from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <Fragment>{children}</Fragment>;
}

export const useTheme = () => ({ theme: 'dark', setTheme: () => {} });