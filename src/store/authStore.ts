import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  role: 'traveller' | 'researcher' | 'admin';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  role: 'traveller' | 'researcher' | 'admin' | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ user: User; profile: Profile } | null>;
  signup: (
    email: string,
    password: string,
    fullName: string,
    username: string,
    role: 'traveller' | 'researcher'
  ) => Promise<{ user: User | null; session: Session | null } | null>;
  logout: () => Promise<void>;
  clearError: () => void;
  sendPasswordReset: (email: string, redirectTo?: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

// Robust profile fetcher that retries to handle trigger race conditions
const fetchProfileWithRetry = async (userId: string, retries = 5, delayMs = 300): Promise<Profile | null> => {
  for (let i = 0; i < retries; i++) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data) return data as Profile;

    if (error) {
      console.error(`Attempt ${i + 1} to fetch profile failed:`, error.message);
    }
    
    if (i < retries - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  role: null,
  session: null,
  loading: true,
  initialized: false,
  error: null,

  clearError: () => set({ error: null }),

  initialize: async () => {
    if (get().initialized) return;

    try {
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session) {
        const profile = await fetchProfileWithRetry(session.user.id);
        set({
          session,
          user: session.user,
          profile,
          role: profile ? profile.role : null,
          loading: false,
          initialized: true,
        });
      } else {
        set({
          session: null,
          user: null,
          profile: null,
          role: null,
          loading: false,
          initialized: true,
        });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        set({ loading: true });
        if (newSession) {
          const profile = await fetchProfileWithRetry(newSession.user.id);
          set({
            session: newSession,
            user: newSession.user,
            profile,
            role: profile ? profile.role : null,
            loading: false,
            initialized: true,
          });
        } else {
          set({
            session: null,
            user: null,
            profile: null,
            role: null,
            loading: false,
            initialized: true,
          });
        }
      });
    } catch (err: any) {
      console.error('Auth initialization error:', err);
      set({
        session: null,
        user: null,
        profile: null,
        role: null,
        loading: false,
        initialized: true,
        error: err.message || 'Failed to initialize session',
      });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!user) throw new Error('No user returned from authentication.');

      const profile = await fetchProfileWithRetry(user.id);
      if (!profile) {
        throw new Error('Profile not found. Please contact support.');
      }

      set({
        user,
        session,
        profile,
        role: profile.role,
        loading: false,
      });
      return { user, profile };
    } catch (err: any) {
      console.error('Login error:', err);
      const friendlyMessage = err.message === 'Invalid login credentials'
        ? 'Unable to sign in. Please check your email and password.'
        : err.message || 'Login failed';
      set({ error: friendlyMessage, loading: false });
      throw new Error(friendlyMessage);
    }
  },

  signup: async (email, password, fullName, username, role) => {
    set({ loading: true, error: null });
    try {
      // Sign up the user with metadata, which triggers the backend insert
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username,
            role,
          },
        },
      });

      if (error) throw error;

      // Handle email verification wait if session is not active
      if (data.user && !data.session) {
        set({ loading: false });
        return { user: data.user, session: null };
      }

      if (data.user && data.session) {
        const profile = await fetchProfileWithRetry(data.user.id);
        set({
          user: data.user,
          session: data.session,
          profile,
          role: profile ? profile.role : null,
          loading: false,
        });
      }

      return data;
    } catch (err: any) {
      console.error('Signup error:', err);
      set({ error: err.message || 'Signup failed', loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      // Clear state regardless of supabase request outcome
      set({
        user: null,
        session: null,
        profile: null,
        role: null,
        loading: false,
      });
    }
  },

  sendPasswordReset: async (email, redirectTo) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      set({ loading: false });
    } catch (err: any) {
      console.error('Password reset request error:', err);
      set({ error: err.message || 'Failed to send password reset email', loading: false });
      throw err;
    }
  },

  updatePassword: async (password) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      set({ loading: false });
    } catch (err: any) {
      console.error('Update password error:', err);
      set({ error: err.message || 'Failed to update password', loading: false });
      throw err;
    }
  },
}));
