import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  role: 'admin' | 'staff' | 'customer' | null; // Add role
  loading: boolean;
  setUser: (user: User | null, role?: 'admin' | 'staff' | 'customer' | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  loading: true,
  setUser: (user, role = null) => set({ user, role }),
  setLoading: (loading) => set({ loading }),
}));
