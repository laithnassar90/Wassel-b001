import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { TripProvider } from './contexts/TripContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { ChatProvider } from './contexts/ChatContext';
import { router } from './router';
import { ErrorBoundary } from './components/ErrorBoundary';
import { validateEnv } from './config/env';

// Validate environment on app startup
if (import.meta?.env?.PROD) {
  const validation = validateEnv();
  if (!validation.valid) {
    console.error('❌ Environment validation failed:', validation.errors);
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <TripProvider>
            <NotificationProvider>
              <PaymentProvider>
                <ChatProvider>
                  <RouterProvider router={router} />
                </ChatProvider>
              </PaymentProvider>
            </NotificationProvider>
          </TripProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}