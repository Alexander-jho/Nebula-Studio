import { create } from 'zustand';
import { User } from 'firebase/auth';
import { Project } from './types';

interface AppState {
  user: User | null;
  loading: boolean;
  activeProject: Project | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setActiveProject: (project: Project | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  loading: true,
  activeProject: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setActiveProject: (project) => set({ activeProject: project }),
}));
