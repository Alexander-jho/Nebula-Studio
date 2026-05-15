import { create } from 'zustand';
import { User } from 'firebase/auth';
import { Project } from './types';

interface AppState {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  activeProject: Project | null;
  setUser: (user: User | null) => void;
  setIsGuest: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
  setActiveProject: (project: Project | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isGuest: false,
  loading: true,
  activeProject: null,
  setUser: (user) => set({ user }),
  setIsGuest: (isGuest) => set({ isGuest }),
  setLoading: (loading) => set({ loading }),
  setActiveProject: (project) => set({ activeProject: project }),
}));
