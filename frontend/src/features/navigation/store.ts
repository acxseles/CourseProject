import { create } from 'zustand';

interface NavigationState {
  activeRoute: string;
  setActiveRoute: (route: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeRoute: '/dashboard',
  setActiveRoute: (route: string) => set({ activeRoute: route }),
}));
