/**
 * Performance Monitoring Utilities
 * Track and log performance metrics
 */

import { env } from '../config/env';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private marks: Map<string, number> = new Map();

  /**
   * Start measuring a performance metric
   */
  startMeasure(name: string) {
    const timestamp = performance.now();
    this.marks.set(name, timestamp);
    
    if (env.ENABLE_DEBUG_MODE) {
      console.log(`⏱️  Started measuring: ${name}`);
    }
  }

  /**
   * End measuring and record the metric
   */
  endMeasure(name: string, metadata?: Record<string, any>) {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`);
      return;
    }

    const endTime = performance.now();
    const value = endTime - startTime;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);
    this.marks.delete(name);

    if (env.ENABLE_DEBUG_MODE) {
      console.log(`✅ Completed measuring: ${name} - ${value.toFixed(2)}ms`, metadata);
    }

    // Send to analytics if enabled
    if (env.ENABLE_ANALYTICS) {
      this.sendToAnalytics(metric);
    }

    return value;
  }

  /**
   * Measure a function execution time
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startMeasure(name);
    try {
      const result = await fn();
      this.endMeasure(name, { ...metadata, status: 'success' });
      return result;
    } catch (error) {
      this.endMeasure(name, { ...metadata, status: 'error', error });
      throw error;
    }
  }

  /**
   * Measure synchronous function execution
   */
  measure<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    this.startMeasure(name);
    try {
      const result = fn();
      this.endMeasure(name, { ...metadata, status: 'success' });
      return result;
    } catch (error) {
      this.endMeasure(name, { ...metadata, status: 'error', error });
      throw error;
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter((m) => m.name === name);
  }

  /**
   * Get average value for a metric
   */
  getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
    this.marks.clear();
  }

  /**
   * Send metric to analytics service
   */
  private sendToAnalytics(metric: PerformanceMetric) {
    // TODO: Implement analytics service integration
    // Example: Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name: metric.name,
        value: Math.round(metric.value),
        event_category: 'Performance',
        ...metric.metadata,
      });
    }
  }

  /**
   * Log performance report
   */
  logReport() {
    if (!env.ENABLE_DEBUG_MODE) return;

    console.group('📊 Performance Report');
    
    const groupedMetrics = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric);
      return acc;
    }, {} as Record<string, PerformanceMetric[]>);

    Object.entries(groupedMetrics).forEach(([name, metrics]) => {
      const avg = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
      const min = Math.min(...metrics.map((m) => m.value));
      const max = Math.max(...metrics.map((m) => m.value));
      
      console.log(`${name}:`, {
        count: metrics.length,
        avg: `${avg.toFixed(2)}ms`,
        min: `${min.toFixed(2)}ms`,
        max: `${max.toFixed(2)}ms`,
      });
    });
    
    console.groupEnd();
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator for measuring React component render time
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const name = componentName || Component.displayName || Component.name || 'Unknown';
  
  return (props: P) => {
    performanceMonitor.startMeasure(`render:${name}`);
    const result = Component(props);
    
    // Use useEffect to measure after render
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        performanceMonitor.endMeasure(`render:${name}`);
      });
    }
    
    return result;
  };
}

/**
 * Report Web Vitals
 */
export function reportWebVitals() {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        const lcp = entry as PerformanceEntry;
        performanceMonitor.measure(
          'web-vital:LCP',
          () => lcp.startTime,
          { value: lcp.startTime }
        );
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // LCP not supported
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const fid = (entry as any).processingStart - entry.startTime;
      performanceMonitor.measure(
        'web-vital:FID',
        () => fid,
        { value: fid }
      );
    }
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // FID not supported
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // CLS not supported
  }

  // Report CLS on page unload
  window.addEventListener('beforeunload', () => {
    performanceMonitor.measure(
      'web-vital:CLS',
      () => clsValue,
      { value: clsValue }
    );
  });
}
