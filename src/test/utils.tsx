/**
 * Test Utilities
 * Helper functions for testing React components
 */

import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { TripProvider } from '../contexts/TripContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { PaymentProvider } from '../contexts/PaymentContext';
import { ChatProvider } from '../contexts/ChatContext';

/**
 * Custom render function that includes all providers
 */
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <TripProvider>
            <NotificationProvider>
              <PaymentProvider>
                <ChatProvider>
                  {children}
                </ChatProvider>
              </PaymentProvider>
            </NotificationProvider>
          </TripProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { wrapper: AllTheProviders, ...options });
}

/**
 * Mock user for testing
 */
export const mockUser = {
  id: 'test-user-1',
  email: 'test@wassel.app',
  name: 'Test User',
  phone: '+966123456789',
  avatar: 'https://example.com/avatar.jpg',
  rating: 4.8,
  totalTrips: 24,
  isDriver: true,
  isVerified: true,
  verificationStatus: 'verified' as const,
  verificationBadges: {
    idVerified: true,
    phoneVerified: true,
    emailVerified: true,
    driverLicenseVerified: true,
  },
  preferences: {
    smoking: false,
    music: true,
    pets: true,
    conversation: 'moderate' as const,
  },
  emergencyContacts: [],
  createdAt: new Date().toISOString(),
};

/**
 * Mock trip for testing
 */
export const mockTrip = {
  id: 'test-trip-1',
  driverId: 'test-user-1',
  driverName: 'Test Driver',
  driverAvatar: 'https://example.com/driver.jpg',
  driverRating: 4.8,
  origin: {
    address: 'Riyadh, Saudi Arabia',
    lat: 24.7136,
    lng: 46.6753,
  },
  destination: {
    address: 'Jeddah, Saudi Arabia',
    lat: 21.5433,
    lng: 39.1728,
  },
  departureTime: new Date(Date.now() + 86400000).toISOString(),
  availableSeats: 3,
  pricePerSeat: 150,
  tripType: 'wasel' as const,
  vehicleInfo: {
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: 'White',
    plateNumber: 'ABC 1234',
  },
  amenities: {
    ac: true,
    wifi: false,
    charger: true,
    music: true,
  },
  preferences: {
    smoking: false,
    pets: false,
    conversation: 'moderate' as const,
  },
  status: 'active' as const,
  createdAt: new Date().toISOString(),
};

/**
 * Wait for async operations
 */
export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create mock router props
 */
export function createMockRouter(overrides = {}) {
  return {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
    ...overrides,
  };
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
