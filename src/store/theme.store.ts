import { create } from 'zustand';
import { STORAGE_KEYS } from '../lib/api';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
  applyTheme: (t: Theme) => void;
}

const saved = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial: Theme = saved ?? (prefersDark ? 'dark' : 'light');

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: initial,

  applyTheme: (t: Theme) => {
    document.documentElement.setAttribute('data-theme', t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggle: () =>
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEYS.THEME, next);
      document.documentElement.setAttribute('data-theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: next };
    }),
}));
