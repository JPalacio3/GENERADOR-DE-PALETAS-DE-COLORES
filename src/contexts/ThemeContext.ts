import { createContext } from 'react';

export const Theme = {
  Light: 'light',
  Dark: 'dark',
} as const;

export type Theme = typeof Theme[keyof typeof Theme];

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
