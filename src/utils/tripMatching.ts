import { Trip } from '../contexts/TripContext';
import { UserProfile } from '../contexts/AuthContext';

interface MatchScore {
  tripId: string;
  score: number;
  reasons: string[];
  compatibilityFactors: {
    route: number;
    preferences: number;
    rating: number;
    price: number;
    timing: number;
  };
}

/**
 * Calculate route compatibility based on location proximity
 * In a real app, this would use actual GPS coordinates and routing APIs
 */
function calculateRouteCompatibility(
  userFrom: string,
  userTo: string,
  tripFrom: string,
  tripTo: string
): number {
  const fromMatch = tripFrom.toLowerCase().includes(userFrom.toLowerCase()) ||
                   userFrom.toLowerCase().includes(tripFrom.toLowerCase());
  const toMatch = tripTo.toLowerCase().includes(userTo.toLowerCase()) ||
                 userTo.toLowerCase().includes(tripTo.toLowerCase());
  
  if (fromMatch && toMatch) return 100;
  if (fromMatch || toMatch) return 60;
  return 20;
}

/**
 * Calculate preference compatibility between user and trip
 */
function calculatePreferenceCompatibility(
  userPreferences: UserProfile['preferences'],
  tripPreferences: Trip['preferences']
): number {
  let score = 0;
  let matches = 0;
  let total = 0;

  // Smoking preference
  if (userPreferences.smoking === tripPreferences.smoking) {
    matches++;
  }
  total++;

  // Music preference
  if (userPreferences.music === tripPreferences.music) {
    matches++;
  }
  total++;

  // Pets preference
  if (userPreferences.pets === tripPreferences.pets) {
    matches++;
  }
  total++;

  // Conversation level (exact match is best, one level difference is okay)
  const conversationLevels = ['quiet', 'moderate', 'chatty'];
  const userLevel = conversationLevels.indexOf(userPreferences.conversation);
  const tripLevel = conversationLevels.indexOf(tripPreferences.conversation);
  const levelDiff = Math.abs(userLevel - tripLevel);
  
  if (levelDiff === 0) {
    matches += 1;
  } else if (levelDiff === 1) {
    matches += 0.5;
  }
  total++;

  score = (matches / total) * 100;
  return score;
}

/**
 * Calculate rating compatibility
 * Higher rated drivers get better scores
 */
function calculateRatingScore(driverRating: number): number {
  return (driverRating / 5) * 100;
}

/**
 * Calculate price attractiveness
 * Lower prices within reasonable range get better scores
 */
function calculatePriceScore(price: number, maxAcceptablePrice: number = 500): number {
  if (price > maxAcceptablePrice) return 0;
  return ((maxAcceptablePrice - price) / maxAcceptablePrice) * 100;
}

/**
 * Calculate timing score based on how soon the trip departs
 * Trips departing soon get higher scores
 */
function calculateTimingScore(departureTime: string): number {
  const now = new Date();
  const departure = new Date(departureTime);
  const hoursUntilDeparture = (departure.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Trips departing in 2-24 hours are ideal
  if (hoursUntilDeparture < 0) return 0; // Past trips
  if (hoursUntilDeparture < 2) return 50; // Too soon
  if (hoursUntilDeparture <= 24) return 100; // Perfect timing
  if (hoursUntilDeparture <= 72) return 70; // Within 3 days
  return 40; // More than 3 days away
}

/**
 * AI-Powered Trip Matching Algorithm
 * Scores trips based on multiple factors and returns ranked results
 */
export function matchTrips(
  userProfile: UserProfile,
  searchCriteria: {
    from: string;
    to: string;
    date?: string;
    maxPrice?: number;
  },
  availableTrips: Trip[]
): MatchScore[] {
  const matches: MatchScore[] = [];

  for (const trip of availableTrips) {
    // Skip cancelled trips or trips with no available seats
    if (trip.status === 'cancelled' || trip.availableSeats === 0) {
      continue;
    }

    // Skip if user is the driver
    if (trip.driverId === userProfile.id) {
      continue;
    }

    const reasons: string[] = [];
    
    // Calculate individual compatibility factors
    const routeScore = calculateRouteCompatibility(
      searchCriteria.from,
      searchCriteria.to,
      trip.from.address,
      trip.to.address
    );
    
    const preferenceScore = calculatePreferenceCompatibility(
      userProfile.preferences,
      trip.preferences
    );
    
    const ratingScore = calculateRatingScore(trip.driverRating);
    
    const priceScore = calculatePriceScore(
      trip.pricePerSeat,
      searchCriteria.maxPrice || 500
    );
    
    const timingScore = calculateTimingScore(trip.departureTime);

    // Weighted scoring system
    const weights = {
      route: 0.35,      // 35% - Most important
      preferences: 0.20, // 20% - User comfort
      rating: 0.20,     // 20% - Trust & safety
      price: 0.15,      // 15% - Cost consideration
      timing: 0.10,     // 10% - Convenience
    };

    const totalScore = 
      routeScore * weights.route +
      preferenceScore * weights.preferences +
      ratingScore * weights.rating +
      priceScore * weights.price +
      timingScore * weights.timing;

    // Generate reasons for the match
    if (routeScore >= 80) {
      reasons.push('Perfect route match');
    } else if (routeScore >= 60) {
      reasons.push('Route is partially compatible');
    }

    if (preferenceScore >= 75) {
      reasons.push('Great compatibility with your preferences');
    }

    if (trip.driverRating >= 4.5) {
      reasons.push('Highly rated driver');
    }

    if (trip.isDriverVerified) {
      reasons.push('Verified driver');
    }

    if (priceScore >= 70) {
      reasons.push('Excellent price');
    }

    if (trip.availableSeats >= 2) {
      reasons.push(`${trip.availableSeats} seats available`);
    }

    matches.push({
      tripId: trip.id,
      score: Math.round(totalScore),
      reasons: reasons.slice(0, 3), // Top 3 reasons
      compatibilityFactors: {
        route: Math.round(routeScore),
        preferences: Math.round(preferenceScore),
        rating: Math.round(ratingScore),
        price: Math.round(priceScore),
        timing: Math.round(timingScore),
      },
    });
  }

  // Sort by score (highest first)
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Get compatibility color based on score
 */
export function getCompatibilityColor(score: number): string {
  if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-gray-600 bg-gray-50 border-gray-200';
}

/**
 * Get compatibility label based on score
 */
export function getCompatibilityLabel(score: number): string {
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Fair Match';
  return 'Low Match';
}
