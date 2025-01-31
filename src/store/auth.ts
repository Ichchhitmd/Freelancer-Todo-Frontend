import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  setToken: (token: string | null) => 
    set({ token, isAuthenticated: !!token }),
  logout: () => 
    set({ token: null, isAuthenticated: false }),
}));
