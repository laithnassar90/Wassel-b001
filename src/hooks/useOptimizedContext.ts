import { useContext, useMemo } from 'react';

/**
 * Optimized Context Hook
 * Prevents unnecessary re-renders by memoizing context values
 */

export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useMemo(() => callback, []);
  return callbackRef;
}

/**
 * Use this hook to prevent context provider re-renders
 * Example:
 * const value = useOptimizedContextValue({
 *   state,
 *   actions: { action1, action2 }
 * });
 */
export function useOptimizedContextValue<T extends Record<string, any>>(
  value: T
): T {
  return useMemo(
    () => value,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.values(value)
  );
}
