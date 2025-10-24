/**
 * Custom Hooks Index
 * Centralized exports for all custom hooks
 */

// Analytics
export { useAnalytics, usePageTracking, useEventTracking, analytics } from './useAnalytics';

// Debounce
export { useDebounce, useDebouncedCallback } from './useDebounce';

// Intersection Observer
export { useIntersectionObserver, useLazyLoad } from './useIntersectionObserver';

// Local Storage
export { useLocalStorage } from './useLocalStorage';

// Context Optimization
export { useStableCallback, useOptimizedContextValue } from './useOptimizedContext';

// PWA
export {
  useInstallPrompt,
  useOnlineStatus,
  usePushNotifications,
  useServiceWorker,
} from './usePWA';

// Re-export from services (for convenience)
export { useWebSocket, useWebSocketEvent } from '../services/websocket';
