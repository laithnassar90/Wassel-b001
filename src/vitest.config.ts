// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

// src/test/setup.ts
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// src/test/utils/testUtils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Wrapper for tests that need routing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// src/test/mocks/supabase.mock.ts
export const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    getSession: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  })),
};

// src/test/services/auth.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../../services/api/auth.service';
import { mockSupabase } from '../mocks/supabase.mock';

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase,
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockUser);
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw error with invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid credentials' },
      });

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrong',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = { id: '123', email: 'new@example.com' };
      const mockProfile = { id: '123', name: 'Test User', email: 'new@example.com' };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
      });

      const result = await authService.register({
        email: 'new@example.com',
        password: 'password123',
        name: 'Test User',
        phone: '+1234567890',
      });

      expect(result).toEqual(mockProfile);
    });
  });
});

// src/test/stores/appStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../stores';

describe('App Store', () => {
  beforeEach(() => {
    const store = useAppStore.getState();
    store.logout(); // Reset store
  });

  describe('User Management', () => {
    it('should set user and mark as authenticated', () => {
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        role: 'passenger' as const,
        verified: true,
        rating: 4.5,
        totalTrips: 10,
      };

      useAppStore.getState().setUser(mockUser);
      
      const state = useAppStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear user on logout', () => {
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        role: 'passenger' as const,
        verified: true,
        rating: 4.5,
        totalTrips: 10,
      };

      useAppStore.getState().setUser(mockUser);
      useAppStore.getState().logout();

      const state = useAppStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Trip Management', () => {
    it('should add a trip', () => {
      const mockTrip: any = {
        id: '1',
        type: 'wasel',
        from: { lat: 31.9539, lng: 35.9106, address: 'Amman', city: 'Amman' },
        to: { lat: 32.5561, lng: 35.8487, address: 'Irbid', city: 'Irbid' },
        departureTime: '2025-10-26T10:00:00Z',
        price: 15,
        availableSeats: 3,
        status: 'pending',
      };

      useAppStore.getState().addTrip(mockTrip);
      
      const state = useAppStore.getState();
      expect(state.trips).toHaveLength(1);
      expect(state.trips[0]).toEqual(mockTrip);
    });

    it('should update a trip', () => {
      const mockTrip: any = {
        id: '1',
        status: 'pending',
        price: 15,
      };

      useAppStore.getState().addTrip(mockTrip);
      useAppStore.getState().updateTrip('1', { status: 'active', price: 20 });
      
      const state = useAppStore.getState();
      expect(state.trips[0].status).toBe('active');
      expect(state.trips[0].price).toBe(20);
    });

    it('should delete a trip', () => {
      const mockTrip: any = { id: '1', status: 'pending' };

      useAppStore.getState().addTrip(mockTrip);
      useAppStore.getState().deleteTrip('1');
      
      const state = useAppStore.getState();
      expect(state.trips).toHaveLength(0);
    });
  });

  describe('Notifications', () => {
    it('should add a notification and increment unread count', () => {
      const notification: any = {
        id: '1',
        type: 'trip_request',
        title: 'New Trip Request',
        message: 'Someone requested to join your trip',
        read: false,
        timestamp: new Date().toISOString(),
      };

      useAppStore.getState().addNotification(notification);
      
      const state = useAppStore.getState();
      expect(state.notifications).toHaveLength(1);
      expect(state.unreadCount).toBe(1);
    });

    it('should mark notification as read', () => {
      const notification: any = {
        id: '1',
        type: 'trip_request',
        title: 'New Trip Request',
        message: 'Someone requested to join your trip',
        read: false,
        timestamp: new Date().toISOString(),
      };

      useAppStore.getState().addNotification(notification);
      useAppStore.getState().markAsRead('1');
      
      const state = useAppStore.getState();
      expect(state.notifications[0].read).toBe(true);
      expect(state.unreadCount).toBe(0);
    });
  });
});

// src/test/components/ErrorBoundary.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils/testUtils';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render error UI when error occurs', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/عذراً، حدث خطأ ما/)).toBeInTheDocument();
    expect(screen.getByText(/Sorry, something went wrong/)).toBeInTheDocument();

    spy.mockRestore();
  });
});

// playwright.config.ts - E2E Test Configuration
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});

// e2e/fixtures/testData.ts
export const testUsers = {
  driver: {
    email: 'driver@test.com',
    password: 'Test123!@#',
    name: 'أحمد السائق',
    phone: '+962791234567',
  },
  passenger: {
    email: 'passenger@test.com',
    password: 'Test123!@#',
    name: 'سارة المسافرة',
    phone: '+962797654321',
  },
  admin: {
    email: 'admin@test.com',
    password: 'Admin123!@#',
  },
};

export const testTrip = {
  type: 'wasel',
  from: {
    address: 'Amman City Center',
    city: 'Amman',
    lat: 31.9539,
    lng: 35.9106,
  },
  to: {
    address: 'Irbid Downtown',
    city: 'Irbid',
    lat: 32.5561,
    lng: 35.8487,
  },
  departureTime: '2025-10-26T10:00:00Z',
  price: 15,
  availableSeats: 3,
  preferences: {
    allowSmoking: false,
    allowPets: true,
    allowMusic: true,
    luggageSpace: 'medium',
  },
};

// e2e/helpers/auth.helper.ts
import { Page } from '@playwright/test';
import { testUsers } from '../fixtures/testData';

export class AuthHelper {
  constructor(private page: Page) {}

  async login(userType: 'driver' | 'passenger' | 'admin' = 'passenger') {
    const user = testUsers[userType];
    
    await this.page.goto('/login');
    await this.page.fill('input[name="email"]', user.email);
    await this.page.fill('input[name="password"]', user.password);
    await this.page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await this.page.waitForURL('/dashboard', { timeout: 10000 });
  }

  async register(userData = testUsers.passenger) {
    await this.page.goto('/register');
    await this.page.fill('input[name="name"]', userData.name);
    await this.page.fill('input[name="email"]', userData.email);
    await this.page.fill('input[name="phone"]', userData.phone);
    await this.page.fill('input[name="password"]', userData.password);
    await this.page.fill('input[name="confirmPassword"]', userData.password);
    await this.page.click('button[type="submit"]');
    
    // Wait for verification or dashboard
    await this.page.waitForURL(/\/(dashboard|verify)/, { timeout: 10000 });
  }

  async logout() {
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('[data-testid="logout-button"]');
    await this.page.waitForURL('/login', { timeout: 5000 });
  }
}

// e2e/helpers/trip.helper.ts
import { Page, expect } from '@playwright/test';
import { testTrip } from '../fixtures/testData';

export class TripHelper {
  constructor(private page: Page) {}

  async createTrip(tripData = testTrip) {
    await this.page.goto('/create-trip');
    
    // Fill trip type
    await this.page.click(`[data-trip-type="${tripData.type}"]`);
    
    // Fill origin
    await this.page.fill('input[name="from.address"]', tripData.from.address);
    await this.page.click(`text=${tripData.from.address}`);
    
    // Fill destination
    await this.page.fill('input[name="to.address"]', tripData.to.address);
    await this.page.click(`text=${tripData.to.address}`);
    
    // Fill departure time
    await this.page.fill('input[name="departureTime"]', tripData.departureTime);
    
    // Fill price and seats
    await this.page.fill('input[name="price"]', tripData.price.toString());
    await this.page.fill('input[name="availableSeats"]', tripData.availableSeats.toString());
    
    // Set preferences
    if (tripData.preferences.allowPets) {
      await this.page.check('input[name="preferences.allowPets"]');
    }
    if (tripData.preferences.allowMusic) {
      await this.page.check('input[name="preferences.allowMusic"]');
    }
    
    // Submit
    await this.page.click('button[type="submit"]');
    
    // Wait for success message or redirect
    await this.page.waitForSelector('[data-testid="trip-created"]', { timeout: 10000 });
  }

  async searchTrip(from: string, to: string, date?: string) {
    await this.page.goto('/find-ride');
    
    await this.page.fill('input[name="from"]', from);
    await this.page.fill('input[name="to"]', to);
    
    if (date) {
      await this.page.fill('input[name="date"]', date);
    }
    
    await this.page.click('button[data-testid="search-button"]');
    
    // Wait for results
    await this.page.waitForSelector('[data-testid="search-results"]', { timeout: 10000 });
  }

  async requestJoinTrip(tripId?: string) {
    if (tripId) {
      await this.page.goto(`/trip/${tripId}`);
    }
    
    await this.page.click('button[data-testid="request-join"]');
    
    // Wait for confirmation
    await this.page.waitForSelector('[data-testid="request-sent"]', { timeout: 5000 });
  }

  async acceptTripRequest(requestId: string) {
    await this.page.goto('/my-trips');
    await this.page.click(`[data-request-id="${requestId}"] button[data-action="accept"]`);
    
    // Wait for confirmation
    await this.page.waitForSelector('[data-testid="request-accepted"]', { timeout: 5000 });
  }
}

// e2e/specs/01-authentication.spec.ts
import { test, expect } from '@playwright/test';
import { AuthHelper } from '../helpers/auth.helper';
import { testUsers } from '../fixtures/testData';

test.describe('Authentication Flow', () => {
  let authHelper: AuthHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('h1')).toContainText(/تسجيل الدخول|Login/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'wrong@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[role="alert"]')).toContainText(/Invalid|خطأ/);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await authHelper.login('passenger');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-name"]')).toContainText(testUsers.passenger.name);
  });

  test('should successfully register new user', async ({ page }) => {
    const uniqueEmail = `test${Date.now()}@test.com`;
    
    await authHelper.register({
      ...testUsers.passenger,
      email: uniqueEmail,
    });
    
    await expect(page).toHaveURL(/\/(dashboard|verify)/);
  });

  test('should successfully logout', async ({ page }) => {
    await authHelper.login('passenger');
    await authHelper.logout();
    
    await expect(page).toHaveURL('/login');
  });

  test('should validate password strength', async ({ page }) => {
    await page.goto('/register');
    
    // Weak password
    await page.fill('input[name="password"]', '123');
    await page.blur('input[name="password"]');
    
    await expect(page.locator('[data-testid="password-strength"]')).toContainText(/weak|ضعيف/i);
    
    // Strong password
    await page.fill('input[name="password"]', 'Strong123!@#');
    await page.blur('input[name="password"]');
    
    await expect(page.locator('[data-testid="password-strength"]')).toContainText(/strong|قوي/i);
  });
});

// e2e/specs/02-trip-creation.spec.ts
import { test, expect } from '@playwright/test';
import { AuthHelper } from '../helpers/auth.helper';
import { TripHelper } from '../helpers/trip.helper';

test.describe('Trip Creation Flow', () => {
  let authHelper: AuthHelper;
  let tripHelper: TripHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    tripHelper = new TripHelper(page);
    
    // Login as driver
    await authHelper.login('driver');
  });

  test('should display trip creation form', async ({ page }) => {
    await page.goto('/create-trip');
    
    await expect(page.locator('h1')).toContainText(/إنشاء رحلة|Create Trip/);
    await expect(page.locator('[data-trip-type="wasel"]')).toBeVisible();
    await expect(page.locator('[data-trip-type="raje3"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/create-trip');
    
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('[data-error="from"]')).toBeVisible();
    await expect(page.locator('[data-error="to"]')).toBeVisible();
    await expect(page.locator('[data-error="price"]')).toBeVisible();
  });

  test('should successfully create a trip', async ({ page }) => {
    await tripHelper.createTrip();
    
    // Should show success message
    await expect(page.locator('[data-testid="trip-created"]')).toContainText(/نجح|Success/);
    
    // Should redirect to trip details or my trips
    await expect(page).toHaveURL(/\/(trip|my-trips)/);
  });

  test('should calculate earnings estimate', async ({ page }) => {
    await page.goto('/create-trip');
    
    await page.fill('input[name="price"]', '15');
    await page.fill('input[name="availableSeats"]', '3');
    
    // Should show estimated earnings
    await expect(page.locator('[data-testid="earnings-estimate"]')).toContainText('45');
  });
});
