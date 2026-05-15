import { create } from 'zustand';
import { User } from 'firebase/auth';
import { Project } from './types';

interface AppState {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  activeProject: Project | null;
  history: any[];
  historyIndex: number;
  setUser: (user: User | null) => void;
  setIsGuest: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
  setActiveProject: (project: Project | null) => void;
  saveHistory: (data: any) => void;
  undo: () => void;
  redo: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isGuest: false,
  loading: true,
  activeProject: null,
  history: [],
  historyIndex: -1,
  setUser: (user) => set({ user }),
  setIsGuest: (isGuest) => set({ isGuest }),
  setLoading: (loading) => set({ loading }),
  setActiveProject: (project) => set({ activeProject: project }),
  saveHistory: (data) => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(JSON.stringify(data));
    if (newHistory.length > 50) newHistory.shift(); // Limit history size
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      return { historyIndex: state.historyIndex - 1 };
    }
    return state;
  }),
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      return { historyIndex: state.historyIndex + 1 };
    }
    return state;
  }),
}));
