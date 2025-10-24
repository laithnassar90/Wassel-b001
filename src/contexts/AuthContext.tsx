import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  rating: number;
  totalTrips: number;
  isDriver: boolean;
  isVerified: boolean;
  verificationStatus: 'none' | 'pending' | 'verified' | 'rejected';
  verificationBadges: {
    idVerified: boolean;
    phoneVerified: boolean;
    emailVerified: boolean;
    driverLicenseVerified: boolean;
  };
  preferences: {
    smoking: boolean;
    music: boolean;
    pets: boolean;
    conversation: 'quiet' | 'moderate' | 'chatty';
  };
  emergencyContacts: Array<{
    id: string;
    name: string;
    phone: string;
    relationship: string;
  }>;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('wassel_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with real Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: UserProfile = {
        id: '1',
        email,
        name: email.split('@')[0],
        rating: 4.8,
        totalTrips: 24,
        isDriver: true,
        isVerified: true,
        verificationStatus: 'verified',
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
          conversation: 'moderate',
        },
        emergencyContacts: [],
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('wassel_user', JSON.stringify(mockUser));
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with real Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        rating: 0,
        totalTrips: 0,
        isDriver: false,
        isVerified: false,
        verificationStatus: 'none',
        verificationBadges: {
          idVerified: false,
          phoneVerified: false,
          emailVerified: true,
          driverLicenseVerified: false,
        },
        preferences: {
          smoking: false,
          music: true,
          pets: false,
          conversation: 'moderate',
        },
        emergencyContacts: [],
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('wassel_user', JSON.stringify(mockUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wassel_user');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      // TODO: Replace with real Supabase update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('wassel_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
