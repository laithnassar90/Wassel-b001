/**
 * Environment Configuration
 * Centralized access to environment variables with validation
 */

interface EnvConfig {
  // App Configuration
  APP_NAME: string;
  APP_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  
  // Supabase Configuration
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  
  // API Configuration
  API_BASE_URL: string;
  API_TIMEOUT: number;
  
  // Feature Flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_ERROR_REPORTING: boolean;
  ENABLE_DEBUG_MODE: boolean;
  
  // Map Configuration
  MAP_API_KEY: string;
  DEFAULT_MAP_CENTER: { lat: number; lng: number };
  
  // Payment Configuration
  STRIPE_PUBLIC_KEY?: string;
  TABBY_PUBLIC_KEY?: string;
  TAMARA_PUBLIC_KEY?: string;
  
  // WebSocket Configuration
  WS_URL: string;
  
  // Storage
  MAX_FILE_SIZE: number; // in bytes
  ALLOWED_FILE_TYPES: string[];
}

function getEnvVar(key: string, defaultValue?: string): string {
  // Safely access import.meta.env with optional chaining
  const envValue = import.meta?.env?.[`VITE_${key}`];
  const value = envValue || defaultValue;
  
  // Only warn if there's no value AND no default was provided
  if (!envValue && defaultValue === undefined) {
    console.warn(`Missing environment variable: VITE_${key} (no default provided)`);
    return '';
  }
  
  return value || '';
}

function getBooleanEnv(key: string, defaultValue: boolean = false): boolean {
  // Safely access import.meta.env with optional chaining
  const envValue = import.meta?.env?.[`VITE_${key}`];
  if (!envValue) return defaultValue;
  return envValue.toLowerCase() === 'true' || envValue === '1';
}

function getNumberEnv(key: string, defaultValue: number): number {
  // Safely access import.meta.env with optional chaining
  const envValue = import.meta?.env?.[`VITE_${key}`];
  if (!envValue) return defaultValue;
  const parsed = parseInt(envValue, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Environment configuration object
export const env: EnvConfig = {
  // App Configuration
  APP_NAME: getEnvVar('APP_NAME', 'Wassel'),
  APP_URL: getEnvVar('APP_URL', 'http://localhost:5173'),
  APP_ENV: (getEnvVar('APP_ENV', 'development') as EnvConfig['APP_ENV']),
  
  // Supabase Configuration
  SUPABASE_URL: getEnvVar('SUPABASE_URL', ''),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY', ''),
  
  // API Configuration
  API_BASE_URL: getEnvVar('API_BASE_URL', 'http://localhost:3000/api'),
  API_TIMEOUT: getNumberEnv('API_TIMEOUT', 30000), // 30 seconds
  
  // Feature Flags
  ENABLE_ANALYTICS: getBooleanEnv('ENABLE_ANALYTICS', false),
  ENABLE_ERROR_REPORTING: getBooleanEnv('ENABLE_ERROR_REPORTING', false),
  ENABLE_DEBUG_MODE: import.meta?.env?.DEV ?? false,
  
  // Map Configuration
  MAP_API_KEY: getEnvVar('MAP_API_KEY', ''),
  DEFAULT_MAP_CENTER: {
    lat: getNumberEnv('DEFAULT_MAP_LAT', 24.7136), // Riyadh
    lng: getNumberEnv('DEFAULT_MAP_LNG', 46.6753),
  },
  
  // Payment Configuration
  STRIPE_PUBLIC_KEY: getEnvVar('STRIPE_PUBLIC_KEY'),
  TABBY_PUBLIC_KEY: getEnvVar('TABBY_PUBLIC_KEY'),
  TAMARA_PUBLIC_KEY: getEnvVar('TAMARA_PUBLIC_KEY'),
  
  // WebSocket Configuration
  WS_URL: getEnvVar('WS_URL', 'ws://localhost:3001'),
  
  // Storage
  MAX_FILE_SIZE: getNumberEnv('MAX_FILE_SIZE', 5242880), // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};

// Validation function - call this at app startup
export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Critical environment variables
  if (env.APP_ENV === 'production') {
    if (!env.SUPABASE_URL) {
      errors.push('SUPABASE_URL is required in production');
    }
    if (!env.SUPABASE_ANON_KEY) {
      errors.push('SUPABASE_ANON_KEY is required in production');
    }
  }
  
  // Validate URLs
  try {
    if (env.SUPABASE_URL) new URL(env.SUPABASE_URL);
    if (env.API_BASE_URL) new URL(env.API_BASE_URL);
  } catch (e) {
    errors.push('Invalid URL format in environment variables');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Log configuration in development
if (import.meta?.env?.DEV) {
  console.group('🔧 Environment Configuration');
  console.log('Environment:', env.APP_ENV);
  console.log('App URL:', env.APP_URL);
  console.log('API URL:', env.API_BASE_URL);
  console.log('Supabase:', env.SUPABASE_URL ? '✓ Configured' : '✗ Not configured');
  console.log('Debug Mode:', env.ENABLE_DEBUG_MODE ? 'ON' : 'OFF');
  console.groupEnd();
  
  const validation = validateEnv();
  if (!validation.valid) {
    console.warn('⚠️ Environment validation warnings:', validation.errors);
  }
}

export default env;