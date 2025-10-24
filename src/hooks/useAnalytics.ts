import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { env } from '../config/env';

/**
 * Analytics Hook
 * Track page views, events, and user interactions
 */

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = env.ENABLE_ANALYTICS;
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string) {
    if (!this.isEnabled) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', env.ENABLE_ANALYTICS, {
        page_path: path,
        page_title: title,
      });
    }

    if (env.ENABLE_DEBUG_MODE) {
      console.log('📊 Page View:', { path, title });
    }
  }

  /**
   * Track custom event
   */
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }

    if (env.ENABLE_DEBUG_MODE) {
      console.log('📊 Event:', event);
    }
  }

  /**
   * Track user signup
   */
  trackSignup(method: string) {
    this.trackEvent({
      category: 'User',
      action: 'signup',
      label: method,
    });
  }

  /**
   * Track user login
   */
  trackLogin(method: string) {
    this.trackEvent({
      category: 'User',
      action: 'login',
      label: method,
    });
  }

  /**
   * Track trip search
   */
  trackTripSearch(from: string, to: string) {
    this.trackEvent({
      category: 'Trip',
      action: 'search',
      metadata: { from, to },
    });
  }

  /**
   * Track trip booking
   */
  trackTripBooking(tripId: string, amount: number) {
    this.trackEvent({
      category: 'Trip',
      action: 'booking',
      label: tripId,
      value: amount,
    });
  }

  /**
   * Track payment
   */
  trackPayment(method: string, amount: number, status: string) {
    this.trackEvent({
      category: 'Payment',
      action: status,
      label: method,
      value: amount,
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: string) {
    this.trackEvent({
      category: 'Error',
      action: error.name,
      label: context,
      metadata: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
}

export const analytics = new AnalyticsService();

/**
 * Hook for page view tracking
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);
}

/**
 * Hook for event tracking
 */
export function useEventTracking() {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analytics.trackEvent(event);
  }, []);

  const trackClick = useCallback((label: string, category: string = 'Button') => {
    analytics.trackEvent({
      category,
      action: 'click',
      label,
    });
  }, []);

  const trackFormSubmit = useCallback((formName: string, success: boolean) => {
    analytics.trackEvent({
      category: 'Form',
      action: success ? 'submit_success' : 'submit_error',
      label: formName,
    });
  }, []);

  return {
    trackEvent,
    trackClick,
    trackFormSubmit,
  };
}

/**
 * Hook for automatic analytics
 */
export function useAnalytics() {
  usePageTracking();
  return analytics;
}
