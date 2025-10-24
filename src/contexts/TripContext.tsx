import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';

export type TripType = 'wasel' | 'raje3';
export type TripStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface Trip {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  driverRating: number;
  driverTotalTrips: number;
  isDriverVerified: boolean;
  type: TripType;
  from: Location;
  to: Location;
  stops: Location[];
  departureTime: string;
  returnTime?: string; // For raje3 trips
  pricePerSeat: number;
  totalSeats: number;
  availableSeats: number;
  vehicleInfo: {
    make: string;
    model: string;
    color: string;
    plate: string;
  };
  preferences: {
    smoking: boolean;
    music: boolean;
    pets: boolean;
    conversation: 'quiet' | 'moderate' | 'chatty';
  };
  status: TripStatus;
  passengers: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    seatsBooked: number;
    status: 'pending' | 'confirmed' | 'rejected';
    requestedAt: string;
  }>;
  createdAt: string;
}

interface TripContextType {
  trips: Trip[];
  createTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'passengers'>) => Promise<Trip>;
  requestJoinTrip: (tripId: string, userId: string, userName: string, seats: number, message?: string) => Promise<void>;
  acceptRequest: (tripId: string, passengerId: string) => Promise<void>;
  rejectRequest: (tripId: string, passengerId: string) => Promise<void>;
  cancelTrip: (tripId: string) => Promise<void>;
  updateTripStatus: (tripId: string, status: TripStatus) => Promise<void>;
  searchTrips: (from: string, to: string, date?: string) => Trip[];
  getUserTrips: (userId: string, role?: 'driver' | 'passenger') => Trip[];
}

const TripContext = createContext<TripContextType | undefined>(undefined);

// Mock data
const mockTrips: Trip[] = [
  {
    id: '1',
    driverId: '2',
    driverName: 'Ahmed Hassan',
    driverAvatar: undefined,
    driverRating: 4.8,
    driverTotalTrips: 142,
    isDriverVerified: true,
    type: 'wasel',
    from: { address: 'Dubai Marina', lat: 25.0808, lng: 55.1396 },
    to: { address: 'Abu Dhabi Corniche', lat: 24.4539, lng: 54.3773 },
    stops: [
      { address: 'Sheikh Zayed Road', lat: 25.1121, lng: 55.2003 },
    ],
    departureTime: '2025-10-13T08:00:00',
    pricePerSeat: 50,
    totalSeats: 4,
    availableSeats: 2,
    vehicleInfo: {
      make: 'Toyota',
      model: 'Camry',
      color: 'Silver',
      plate: 'D-12345',
    },
    preferences: {
      smoking: false,
      music: true,
      pets: false,
      conversation: 'moderate',
    },
    status: 'upcoming',
    passengers: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    driverId: '3',
    driverName: 'Sara Mohammed',
    driverAvatar: undefined,
    driverRating: 4.9,
    driverTotalTrips: 89,
    isDriverVerified: true,
    type: 'raje3',
    from: { address: 'Sharjah City Center', lat: 25.3292, lng: 55.3714 },
    to: { address: 'Dubai Mall', lat: 25.1972, lng: 55.2744 },
    stops: [],
    departureTime: '2025-10-13T09:00:00',
    returnTime: '2025-10-13T18:00:00',
    pricePerSeat: 30,
    totalSeats: 3,
    availableSeats: 3,
    vehicleInfo: {
      make: 'Honda',
      model: 'Accord',
      color: 'White',
      plate: 'S-67890',
    },
    preferences: {
      smoking: false,
      music: true,
      pets: true,
      conversation: 'chatty',
    },
    status: 'upcoming',
    passengers: [],
    createdAt: new Date().toISOString(),
  },
];

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);

  const createTrip = async (tripData: Omit<Trip, 'id' | 'createdAt' | 'passengers'>): Promise<Trip> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTrip: Trip = {
      ...tripData,
      id: Math.random().toString(36).substr(2, 9),
      passengers: [],
      createdAt: new Date().toISOString(),
    };

    setTrips(prev => [...prev, newTrip]);
    toast.success('Trip created successfully!');
    return newTrip;
  };

  const requestJoinTrip = async (tripId: string, userId: string, userName: string, seats: number, message?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          passengers: [
            ...trip.passengers,
            {
              id: Math.random().toString(36).substr(2, 9),
              userId,
              userName,
              seatsBooked: seats,
              status: 'pending',
              requestedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return trip;
    }));

    toast.success('Trip request sent!');
  };

  const acceptRequest = async (tripId: string, passengerId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        const passenger = trip.passengers.find(p => p.id === passengerId);
        if (passenger) {
          return {
            ...trip,
            availableSeats: trip.availableSeats - passenger.seatsBooked,
            passengers: trip.passengers.map(p =>
              p.id === passengerId ? { ...p, status: 'confirmed' as const } : p
            ),
          };
        }
      }
      return trip;
    }));

    toast.success('Request accepted!');
  };

  const rejectRequest = async (tripId: string, passengerId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          passengers: trip.passengers.map(p =>
            p.id === passengerId ? { ...p, status: 'rejected' as const } : p
          ),
        };
      }
      return trip;
    }));

    toast.success('Request rejected');
  };

  const cancelTrip = async (tripId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTrips(prev => prev.map(trip =>
      trip.id === tripId ? { ...trip, status: 'cancelled' as const } : trip
    ));

    toast.success('Trip cancelled');
  };

  const updateTripStatus = async (tripId: string, status: TripStatus) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTrips(prev => prev.map(trip =>
      trip.id === tripId ? { ...trip, status } : trip
    ));
  };

  const searchTrips = (from: string, to: string, date?: string): Trip[] => {
    return trips.filter(trip => {
      const fromMatch = trip.from.address.toLowerCase().includes(from.toLowerCase());
      const toMatch = trip.to.address.toLowerCase().includes(to.toLowerCase());
      const dateMatch = !date || trip.departureTime.startsWith(date);
      return fromMatch && toMatch && dateMatch && trip.status !== 'cancelled';
    });
  };

  const getUserTrips = (userId: string, role?: 'driver' | 'passenger'): Trip[] => {
    return trips.filter(trip => {
      if (role === 'driver') {
        return trip.driverId === userId;
      } else if (role === 'passenger') {
        return trip.passengers.some(p => p.userId === userId && p.status === 'confirmed');
      }
      return trip.driverId === userId || trip.passengers.some(p => p.userId === userId);
    });
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        createTrip,
        requestJoinTrip,
        acceptRequest,
        rejectRequest,
        cancelTrip,
        updateTripStatus,
        searchTrips,
        getUserTrips,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}
