import { create } from 'zustand';

interface ThemeStore {
  theme: 'light';
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeStore>(() => ({
  theme: 'light',

  applyTheme: () => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  },
}));
