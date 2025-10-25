// src/services/api/config.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// API Configuration
export const API_CONFIG = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// src/services/api/base.service.ts
export class BaseApiService {
  protected async handleRequest<T>(
    request: () => Promise<{ data: T | null; error: any }>
  ): Promise<T> {
    try {
      const { data, error } = await request();
      
      if (error) {
        throw new ApiError(error.message, error.code, error);
      }
      
      if (!data) {
        throw new ApiError('No data returned', 'NO_DATA');
      }
      
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        'UNKNOWN_ERROR'
      );
    }
  }

  protected async retry<T>(
    fn: () => Promise<T>,
    attempts = API_CONFIG.retryAttempts
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (attempts <= 1) throw error;
      await this.delay(API_CONFIG.retryDelay);
      return this.retry(fn, attempts - 1);
    }
  }

  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// src/services/api/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

// src/services/api/auth.service.ts
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export class AuthService extends BaseApiService {
  async login(credentials: LoginCredentials) {
    return this.handleRequest(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      return { data: data.user, error };
    });
  }

  async register(userData: RegisterData) {
    return this.handleRequest(async () => {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) return { data: null, error: authError };

      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user!.id,
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
        })
        .select()
        .single();

      return { data: profileData, error: profileError };
    });
  }

  async logout() {
    return this.handleRequest(async () => {
      const { error } = await supabase.auth.signOut();
      return { data: true, error };
    });
  }

  async getCurrentUser() {
    return this.handleRequest(async () => {
      const { data, error } = await supabase.auth.getUser();
      return { data: data.user, error };
    });
  }

  async resetPassword(email: string) {
    return this.handleRequest(async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      return { data, error };
    });
  }

  async updatePassword(newPassword: string) {
    return this.handleRequest(async () => {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { data: data.user, error };
    });
  }
}

// src/services/api/trip.service.ts
interface CreateTripData {
  type: 'wasel' | 'raje3';
  from: { lat: number; lng: number; address: string; city: string };
  to: { lat: number; lng: number; address: string; city: string };
  departureTime: string;
  returnTime?: string;
  price: number;
  availableSeats: number;
  preferences: {
    allowSmoking: boolean;
    allowPets: boolean;
    allowMusic: boolean;
    luggageSpace: 'small' | 'medium' | 'large';
  };
}

interface SearchTripParams {
  from?: string;
  to?: string;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
  tripType?: 'wasel' | 'raje3';
}

export class TripService extends BaseApiService {
  async createTrip(tripData: CreateTripData) {
    return this.handleRequest(async () => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new AuthenticationError();
      }

      const { data, error } = await supabase
        .from('trips')
        .insert({
          ...tripData,
          driver_id: user.user.id,
          status: 'pending',
        })
        .select()
        .single();

      return { data, error };
    });
  }

  async searchTrips(params: SearchTripParams) {
    return this.handleRequest(async () => {
      let query = supabase
        .from('trips')
        .select('*, driver:profiles(*), passengers:trip_passengers(passenger:profiles(*))')
        .eq('status', 'pending');

      if (params.from) {
        query = query.ilike('from->>city', `%${params.from}%`);
      }
      
      if (params.to) {
        query = query.ilike('to->>city', `%${params.to}%`);
      }
      
      if (params.date) {
        query = query.gte('departure_time', `${params.date}T00:00:00`)
                     .lte('departure_time', `${params.date}T23:59:59`);
      }
      
      if (params.minPrice) {
        query = query.gte('price', params.minPrice);
      }
      
      if (params.maxPrice) {
        query = query.lte('price', params.maxPrice);
      }
      
      if (params.tripType) {
        query = query.eq('type', params.tripType);
      }

      const { data, error } = await query.order('departure_time', { ascending: true });
      
      return { data, error };
    });
  }

  async getTripById(tripId: string) {
    return this.handleRequest(async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*, driver:profiles(*), passengers:trip_passengers(passenger:profiles(*))')
        .eq('id', tripId)
        .single();

      if (!data && !error) {
        throw new NotFoundError('Trip');
      }

      return { data, error };
    });
  }

  async getUserTrips(userId?: string) {
    return this.handleRequest(async () => {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) {
        throw new AuthenticationError();
      }

      const { data, error } = await supabase
        .from('trips')
        .select('*, driver:profiles(*), passengers:trip_passengers(passenger:profiles(*))')
        .or(`driver_id.eq.${targetUserId},trip_passengers.passenger_id.eq.${targetUserId}`)
        .order('departure_time', { ascending: false });

      return { data, error };
    });
  }

  async updateTrip(tripId: string, updates: Partial<CreateTripData>) {
    return this.handleRequest(async () => {
      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', tripId)
        .select()
        .single();

      return { data, error };
    });
  }

  async cancelTrip(tripId: string, reason?: string) {
    return this.handleRequest(async () => {
      const { data, error } = await supabase
        .from('trips')
        .update({ 
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', tripId)
        .select()
        .single();

      return { data, error };
    });
  }

  async requestJoinTrip(tripId: string) {
    return this.handleRequest(async () => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new AuthenticationError();
      }

      const { data, error } = await supabase
        .from('trip_requests')
        .insert({
          trip_id: tripId,
          passenger_id: user.user.id,
          status: 'pending',
        })
        .select()
        .single();

      return { data, error };
    });
  }

  async acceptTripRequest(requestId: string) {
    return this.handleRequest(async () => {
      // Update request status
      const { error: requestError } = await supabase
        .from('trip_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (requestError) return { data: null, error: requestError };

      // Get request details
      const { data: request, error: fetchError } = await supabase
        .from('trip_requests')
        .select('trip_id, passenger_id')
        .eq('id', requestId)
        .single();

      if (fetchError) return { data: null, error: fetchError };

      // Add passenger to trip
      const { data, error } = await supabase
        .from('trip_passengers')
        .insert({
          trip_id: request.trip_id,
          passenger_id: request.passenger_id,
        })
        .select()
        .single();

      return { data, error };
    });
  }
}

// src/services/api/payment.service.ts
interface PaymentData {
  tripId: string;
  amount: number;
  method: 'card' | 'wallet' | 'bnpl' | 'cash';
  provider?: string;
}

interface RefundData {
  paymentId: string;
  amount: number;
  reason: string;
}

export class PaymentService extends BaseApiService {
  async createPayment(paymentData: PaymentData) {
    return this.handleRequest(async () => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new AuthenticationError();
      }

      // Create payment record
      const { data, error } = await supabase
        .from('payments')
        .insert({
          trip_id: paymentData.tripId,
          user_id: user.user.id,
          amount: paymentData.amount,
          method: paymentData.method,
          provider: paymentData.provider,
          status: 'pending',
        })
        .select()
        .single();

      return { data, error };
    });
  }

  async confirmPayment(paymentId: string, transactionId: string) {
    return this.handleRequest(async () => {
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          transaction_id: transactionId,
          completed_at: new Date().toISOString(),
        })
        .eq('id', paymentId)
        .select()
        .single();

      return { data, error };
    });
  }

  async refundPayment(refundData: RefundData) {
    return this.handleRequest(async () => {
      // Create refund record
      const { data, error } = await supabase
        .from('refunds')
        .insert({
          payment_id: refundData.paymentId,
          amount: refundData.amount,
          reason: refundData.reason,
          status: 'pending',
        })
        .select()
        .single();

      return { data, error };
    });
  }

  async getPaymentHistory(userId?: string) {
    return this.handleRequest(async () => {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) {
        throw new AuthenticationError();
      }

      const { data, error } = await supabase
        .from('payments')
        .select('*, trip:trips(*)')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      return { data, error };
    });
  }
}

// src/services/api/notification.service.ts
interface CreateNotificationData {
  userId: string;
  type: 'trip_request' | 'trip_accepted' | 'trip_cancelled' | 'message' | 'payment';
  title: string;
  message: string;
  tripId?: string;
}

export class NotificationService extends BaseApiService {
  async createNotification(notificationData: CreateNotificationData) {
    return this.handleRequest(async () => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notificationData.userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          trip_id: notificationData.tripId,
          read: false,
        })
        .select()
        .single();

      return { data, error };
    });
  }

  async getUserNotifications(userId?: string) {
    return this.handleRequest(async () => {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) {
        throw new AuthenticationError();
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      return { data, error };
    });
  }

  async markAsRead(notificationId: string) {
    return this.handleRequest(async () => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single();

      return { data, error };
    });
  }

  async markAllAsRead(userId: string) {
    return this.handleRequest(async () => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)
        .select();

      return { data, error };
    });
  }

  async deleteNotification(notificationId: string) {
    return this.handleRequest(async () => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      return { data: true, error };
    });
  }
}

// src/services/api/profile.service.ts
interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
}

interface VerificationData {
  type: 'id' | 'phone' | 'driver_license';
  documentUrl: string;
  documentNumber: string;
}

export class ProfileService extends BaseApiService {
  async getProfile(userId?: string) {
    return this.handleRequest(async () => {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) {
        throw new AuthenticationError();
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (!data && !error) {
        throw new NotFoundError('Profile');
      }

      return { data, error };
    });
  }

  async updateProfile(updates: UpdateProfileData) {
    return this.handleRequest(async () => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new AuthenticationError();
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.user.id)
        .select()
        .single();

      return { data, error };
    });
  }

  async submitVerification(verificationData: VerificationData) {
    return this.handleRequest(async () => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new AuthenticationError();
      }

      const { data, error } = await supabase
        .from('verifications')
        .insert({
          user_id: user.user.id,
          type: verificationData.type,
          document_url: verificationData.documentUrl,
          document_number: verificationData.documentNumber,
          status: 'pending',
        })
        .select()
        .single();

      return { data, error };
    });
  }

  async uploadAvatar(file: File) {
    return this.handleRequest(async () => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new AuthenticationError();
      }

      const fileName = `${user.user.id}/${Date.now()}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (error) return { data: null, error };

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return { data: urlData.publicUrl, error: null };
    });
  }
}

// src/services/api/index.ts - Service Aggregator
export class ApiService {
  private static instance: ApiService;
  
  public auth: AuthService;
  public trip: TripService;
  public payment: PaymentService;
  public notification: NotificationService;
  public profile: ProfileService;

  private constructor() {
    this.auth = new AuthService();
    this.trip = new TripService();
    this.payment = new PaymentService();
    this.notification = new NotificationService();
    this.profile = new ProfileService();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
}

// Export singleton instance
export const api = ApiService.getInstance();