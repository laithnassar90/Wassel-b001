import { useEffect, useState, useRef } from 'react';

/**
 * Intersection Observer Hook
 * Useful for lazy loading, infinite scroll, animations on scroll
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
}

/**
 * Lazy Load Hook
 * Only loads content when it's about to enter the viewport
 */
export function useLazyLoad<T>(
  loadFn: () => Promise<T>,
  options?: IntersectionObserverInit
): [React.RefObject<HTMLDivElement>, T | null, boolean] {
  const [ref, isIntersecting] = useIntersectionObserver(options);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isIntersecting && !data && !isLoading) {
      setIsLoading(true);
      loadFn()
        .then(setData)
        .finally(() => setIsLoading(false));
    }
  }, [isIntersecting, data, isLoading, loadFn]);

  return [ref, data, isLoading];
}
