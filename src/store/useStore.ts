import { create } from 'zustand';
import { UserProfile, Match, Message, Notification } from '../types';
import api from '../lib/api';

interface AppState {
  user: UserProfile | null;
  discoveryProfiles: UserProfile[];
  matches: Match[];
  notifications: Notification[];
  isDiscoveryLoading: boolean;
  isMatchesLoading: boolean;
  error: string | null;

  // Actions
  fetchDiscovery: () => Promise<void>;
  likeProfile: (id: string) => Promise<boolean>;
  fetchMatches: () => Promise<void>;
  sendChatMessage: (matchId: string, text: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: {
    id: 'me',
    name: 'Alex',
    age: 28,
    bio: 'Looking for meaningful connections.',
    images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6'],
    location: 'Current Location',
    interests: ['Travel', 'Coffee', 'Design'],
    verified: true,
    prompts: [],
    subscriptionTier: 'free'
  },
  discoveryProfiles: [],
  matches: [],
  notifications: [],
  isDiscoveryLoading: false,
  isMatchesLoading: false,
  error: null,

  fetchDiscovery: async () => {
    set({ isDiscoveryLoading: true });
    try {
      const res = await api.get('/discovery');
      const data = res.data;
      set({ discoveryProfiles: data, isDiscoveryLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch profiles', isDiscoveryLoading: false });
    }
  },

  likeProfile: async (targetId: string) => {
    try {
      const res = await api.post('/discovery/like', { targetId });
      const data = res.data;
      
      if (data.status === 'match') {
        set(state => ({ 
          matches: [data.match, ...state.matches],
          notifications: [{
            id: Math.random().toString(),
            type: 'match',
            title: 'New Match!',
            content: `You matched with ${data.match.user.name}`,
            timestamp: new Date().toISOString(),
            read: false
          }, ...state.notifications]
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  fetchMatches: async () => {
    set({ isMatchesLoading: true });
    try {
      const res = await api.get('/matches');
      const data = res.data;
      set({ matches: data, isMatchesLoading: false });
    } catch (err) {
      console.error(err);
      set({ isMatchesLoading: false });
    }
  },

  sendChatMessage: async (matchId: string, text: string) => {
    try {
      await api.post('/chat/send', { matchId, text });
    } catch (err) {
      console.error(err);
    }
  },

  addNotification: (notification) => {
    set(state => ({
      notifications: [{
        ...notification,
        id: Math.random().toString(),
        timestamp: new Date().toISOString(),
        read: false
      }, ...state.notifications]
    }));
  },

  markNotificationRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },

  updateProfile: (updates) => {
    set(state => ({
      user: state.user ? { ...state.user, ...updates } : null
    }));
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },
}));
