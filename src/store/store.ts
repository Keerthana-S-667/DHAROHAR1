import { create } from 'zustand';
import { Language, TravellerPreferences, SavedResearchItem } from '../types';

export interface GlobalState {
  selectedUserRole: 'traveller' | 'researcher' | null;
  language: Language;
  userLocation: { latitude: number; longitude: number } | null;
  locationPermissionState: 'granted' | 'denied' | 'prompt' | 'unknown';
  selectedDestination: string | null;
  selectedMonument: string | null;
  travellerPreferences: TravellerPreferences | null;
  selectedTrail: string | null;
  
  // Research State Extensions
  researchQuery: string;
  researchFilters: Record<string, string[]>;
  savedResearchItems: SavedResearchItem[];
  selectedComparisonMonuments: string[];

  // Navigation History
  recentlyViewedMonuments: string[];   // max 5, most recent first

  setSelectedUserRole: (role: 'traveller' | 'researcher' | null) => void;
  setLanguage: (lang: Language) => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  setLocationPermissionState: (state: 'granted' | 'denied' | 'prompt' | 'unknown') => void;
  setSelectedDestination: (destId: string | null) => void;
  setSelectedMonument: (monumentId: string | null) => void;
  setTravellerPreferences: (prefs: TravellerPreferences | null) => void;
  setSelectedTrail: (trailId: string | null) => void;

  // Research Actions
  setResearchQuery: (query: string) => void;
  setResearchFilters: (filters: Record<string, string[]>) => void;
  addSavedResearchItem: (item: Omit<SavedResearchItem, 'id' | 'timestamp'>) => void;
  removeSavedResearchItem: (id: string) => void;
  addComparisonMonument: (monumentId: string) => void;
  removeComparisonMonument: (monumentId: string) => void;
  clearComparisonMonuments: () => void;

  // Navigation History Actions
  addRecentlyViewed: (monumentId: string) => void;
}

const getStoredResearch = (): SavedResearchItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('dharohar_saved_research');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse saved research:', err);
    return [];
  }
};

const getStoredRecentlyViewed = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('dharohar_recently_viewed');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const useStore = create<GlobalState>((set) => ({
  selectedUserRole: null,
  language: 'en',
  userLocation: null,
  locationPermissionState: 'unknown',
  selectedDestination: null,
  selectedMonument: null,
  travellerPreferences: null,
  selectedTrail: null,
  
  // Initial Research State
  researchQuery: '',
  researchFilters: {},
  savedResearchItems: getStoredResearch(),
  selectedComparisonMonuments: [],

  // Navigation History
  recentlyViewedMonuments: getStoredRecentlyViewed(),

  setSelectedUserRole: (role) => set({ selectedUserRole: role }),
  setLanguage: (lang) => set({ language: lang }),
  setUserLocation: (location) => set({ userLocation: location }),
  setLocationPermissionState: (state) => set({ locationPermissionState: state }),
  setSelectedDestination: (destId) => set({ selectedDestination: destId }),
  setSelectedMonument: (monumentId) => set({ selectedMonument: monumentId }),
  setTravellerPreferences: (prefs) => set({ travellerPreferences: prefs }),
  setSelectedTrail: (trailId) => set({ selectedTrail: trailId }),

  // Research Actions Realization
  setResearchQuery: (query) => set({ researchQuery: query }),
  setResearchFilters: (filters) => set({ researchFilters: filters }),
  
  addSavedResearchItem: (item) => set((state) => {
    const newItem: SavedResearchItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now()
    };
    const updated = [newItem, ...state.savedResearchItems];
    localStorage.setItem('dharohar_saved_research', JSON.stringify(updated));
    return { savedResearchItems: updated };
  }),

  removeSavedResearchItem: (id) => set((state) => {
    const updated = state.savedResearchItems.filter((i) => i.id !== id);
    localStorage.setItem('dharohar_saved_research', JSON.stringify(updated));
    return { savedResearchItems: updated };
  }),

  addComparisonMonument: (monumentId) => set((state) => {
    if (state.selectedComparisonMonuments.includes(monumentId)) return {};
    return { selectedComparisonMonuments: [...state.selectedComparisonMonuments, monumentId] };
  }),

  removeComparisonMonument: (monumentId) => set((state) => ({
    selectedComparisonMonuments: state.selectedComparisonMonuments.filter((id) => id !== monumentId)
  })),

  clearComparisonMonuments: () => set({ selectedComparisonMonuments: [] }),

  addRecentlyViewed: (monumentId) => set((state) => {
    const filtered = state.recentlyViewedMonuments.filter(id => id !== monumentId);
    const updated = [monumentId, ...filtered].slice(0, 5);
    try { localStorage.setItem('dharohar_recently_viewed', JSON.stringify(updated)); } catch {}
    return { recentlyViewedMonuments: updated };
  }),
}));

if (typeof window !== 'undefined') {
  (window as any).useStore = useStore;
}
