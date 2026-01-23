import { create } from 'zustand';

interface UIState {
  showEditor: boolean;
  sidebarWidth: number;
  chatPanelWidth: number;
  theme: 'light' | 'dark' | 'system';

  // Actions
  toggleEditor: () => void;
  setShowEditor: (show: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setChatPanelWidth: (width: number) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>((set) => ({
  showEditor: false,
  sidebarWidth: 200,
  chatPanelWidth: 384,
  theme: 'system',

  toggleEditor: () => {
    set((state) => ({ showEditor: !state.showEditor }));
  },

  setShowEditor: (show) => {
    set({ showEditor: show });
  },

  setSidebarWidth: (width) => {
    set({ sidebarWidth: Math.max(150, Math.min(400, width)) });
  },

  setChatPanelWidth: (width) => {
    set({ chatPanelWidth: Math.max(300, Math.min(600, width)) });
  },

  setTheme: (theme) => {
    set({ theme });
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  },
}));
