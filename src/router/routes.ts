// Route paths for programmatic navigation
// This file is separate from index.tsx to avoid circular dependencies

export const routes = {
  home: '/',
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },
  app: {
    dashboard: '/app/dashboard',
    findRide: '/app/find-ride',
    offerRide: '/app/offer-ride',
    trips: '/app/trips',
    messages: '/app/messages',
    payments: '/app/payments',
    settings: '/app/settings',
    profile: (userId?: string) => `/app/profile${userId ? `/${userId}` : ''}`,
  },
} as const;
