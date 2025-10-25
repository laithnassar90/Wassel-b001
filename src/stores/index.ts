// src/stores/index.ts - Main Store Configuration
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'driver' | 'passenger' | 'both';
  verified: boolean;
  rating: number;
  totalTrips: number;
}

interface Trip {
  id: string;
  type: 'wasel' | 'raje3';
  from: Location;
  to: Location;
  departureTime: string;
  returnTime?: string;
  price: number;
  availableSeats: number;
  driver: User;
  passengers: User[];
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  preferences: TripPreferences;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
}

interface TripPreferences {
  allowSmoking: boolean;
  allowPets: boolean;
  allowMusic: boolean;
  luggageSpace: 'small' | 'medium' | 'large';
}

interface Notification {
  id: string;
  type: 'trip_request' | 'trip_accepted' | 'trip_cancelled' | 'message' | 'payment';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  tripId?: string;
}

interface AppState {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Trip State
  trips: Trip[];
  activeTrip: Trip | null;
  searchResults: Trip[];
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  setActiveTrip: (trip: Trip | null) => void;
  setSearchResults: (results: Trip[]) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;

  // UI State
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  isLoading: boolean;
  error: string | null;
  setLanguage: (lang: 'en' | 'ar') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Search Filters
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  resetSearchFilters: () => void;
}

interface SearchFilters {
  from?: Location;
  to?: Location;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
  tripType?: 'wasel' | 'raje3';
  preferences?: Partial<TripPreferences>;
}

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  trips: [],
  activeTrip: null,
  searchResults: [],
  notifications: [],
  unreadCount: 0,
  language: 'en' as const,
  theme: 'light' as const,
  isLoading: false,
  error: null,
  searchFilters: {},
};

// Main Store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // User Actions
        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),

        logout: () =>
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.activeTrip = null;
            state.trips = [];
          }),

        // Trip Actions
        setTrips: (trips) =>
          set((state) => {
            state.trips = trips;
          }),

        addTrip: (trip) =>
          set((state) => {
            state.trips.push(trip);
          }),

        updateTrip: (tripId, updates) =>
          set((state) => {
            const index = state.trips.findIndex((t) => t.id === tripId);
            if (index !== -1) {
              state.trips[index] = { ...state.trips[index], ...updates };
            }
            if (state.activeTrip?.id === tripId) {
              state.activeTrip = { ...state.activeTrip, ...updates };
            }
          }),

        deleteTrip: (tripId) =>
          set((state) => {
            state.trips = state.trips.filter((t) => t.id !== tripId);
            if (state.activeTrip?.id === tripId) {
              state.activeTrip = null;
            }
          }),

        setActiveTrip: (trip) =>
          set((state) => {
            state.activeTrip = trip;
          }),

        setSearchResults: (results) =>
          set((state) => {
            state.searchResults = results;
          }),

        // Notification Actions
        addNotification: (notification) =>
          set((state) => {
            state.notifications.unshift(notification);
            if (!notification.read) {
              state.unreadCount += 1;
            }
          }),

        markAsRead: (notificationId) =>
          set((state) => {
            const notification = state.notifications.find(
              (n) => n.id === notificationId
            );
            if (notification && !notification.read) {
              notification.read = true;
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          }),

        markAllAsRead: () =>
          set((state) => {
            state.notifications.forEach((n) => {
              n.read = true;
            });
            state.unreadCount = 0;
          }),

        clearNotifications: () =>
          set((state) => {
            state.notifications = [];
            state.unreadCount = 0;
          }),

        // UI Actions
        setLanguage: (lang) =>
          set((state) => {
            state.language = lang;
            document.dir = lang === 'ar' ? 'rtl' : 'ltr';
          }),

        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
            document.documentElement.classList.toggle('dark', theme === 'dark');
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        // Search Filter Actions
        setSearchFilters: (filters) =>
          set((state) => {
            state.searchFilters = filters;
          }),

        resetSearchFilters: () =>
          set((state) => {
            state.searchFilters = {};
          }),
      })),
      {
        name: 'wassel-storage',
        partialize: (state) => ({
          user: state.user,
          language: state.language,
          theme: state.theme,
          searchFilters: state.searchFilters,
        }),
      }
    ),
    { name: 'WasselStore' }
  )
);

// Selectors for optimized re-renders
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useTrips = () => useAppStore((state) => state.trips);
export const useActiveTrip = () => useAppStore((state) => state.activeTrip);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUnreadCount = () => useAppStore((state) => state.unreadCount);
export const useLanguage = () => useAppStore((state) => state.language);
export const useTheme = () => useAppStore((state) => state.theme);
export const useSearchFilters = () => useAppStore((state) => state.searchFilters);