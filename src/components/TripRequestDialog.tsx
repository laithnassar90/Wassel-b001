import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTrips, Trip } from '../contexts/TripContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  MapPin,
  Star,
  Users,
  Calendar,
  Clock,
  Car,
  Shield,
  MessageCircle,
  Check,
  X,
  Cigarette,
  Music,
  Dog,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TripRequestDialogProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
}

export function TripRequestDialog({ trip, isOpen, onClose }: TripRequestDialogProps) {
  const { user } = useAuth();
  const { requestJoinTrip } = useTrips();
  const { t } = useLanguage();
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = trip.pricePerSeat * seats;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await requestJoinTrip(trip.id, user.id, user.name, seats, message);
      onClose();
      setSeats(1);
      setMessage('');
    } catch (error) {
      toast.error('Failed to send request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Trip Details</DialogTitle>
          <DialogDescription>
            Review trip information and send your join request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Driver Info */}
          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <Avatar className="size-16">
              <AvatarImage src={trip.driverAvatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {trip.driverName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-lg">{trip.driverName}</h3>
                {trip.isDriverVerified && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Shield className="size-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{trip.driverRating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Car className="size-4" />
                  <span>{trip.driverTotalTrips} trips</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <MessageCircle className="size-4 mr-2" />
              Message
            </Button>
          </div>

          {/* Trip Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={trip.type === 'wasel' ? 'bg-primary' : 'bg-secondary'}>
                {trip.type === 'wasel' ? t('trip.wasel') : t('trip.raje3')}
              </Badge>
            </div>

            {/* Route */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">{trip.from.address}</p>
                  <p className="text-sm text-muted-foreground">Starting point</p>
                </div>
              </div>

              {trip.stops.length > 0 && (
                <div className="ml-2 border-l-2 border-dashed border-muted-foreground/30 pl-6 py-2 space-y-2">
                  {trip.stops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="size-2 rounded-full bg-muted-foreground/50" />
                      {stop.address}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">{trip.to.address}</p>
                  <p className="text-sm text-muted-foreground">Destination</p>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Departure</p>
                  <p className="font-medium">
                    {new Date(trip.departureTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Clock className="size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            {trip.type === 'raje3' && trip.returnTime && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Clock className="size-5 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Return Time</p>
                  <p className="font-medium">
                    {new Date(trip.returnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Car className="size-5 text-primary" />
              Vehicle Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Make & Model</p>
                <p className="font-medium">{trip.vehicleInfo.make} {trip.vehicleInfo.model}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Color</p>
                <p className="font-medium">{trip.vehicleInfo.color}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Plate Number</p>
                <p className="font-medium">{trip.vehicleInfo.plate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Available Seats</p>
                <p className="font-medium">{trip.availableSeats} / {trip.totalSeats}</p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h4 className="font-medium mb-3">Ride Preferences</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant={trip.preferences.smoking ? 'default' : 'secondary'} className="gap-1">
                <Cigarette className="size-3" />
                {trip.preferences.smoking ? 'Smoking allowed' : 'No smoking'}
              </Badge>
              <Badge variant={trip.preferences.music ? 'default' : 'secondary'} className="gap-1">
                <Music className="size-3" />
                {trip.preferences.music ? 'Music allowed' : 'No music'}
              </Badge>
              <Badge variant={trip.preferences.pets ? 'default' : 'secondary'} className="gap-1">
                <Dog className="size-3" />
                {trip.preferences.pets ? 'Pets allowed' : 'No pets'}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {trip.preferences.conversation} conversation
              </Badge>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
            <div>
              <Label>Number of Seats</Label>
              <div className="flex items-center gap-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  disabled={seats <= 1}
                >
                  -
                </Button>
                <span className="font-medium text-xl w-12 text-center">{seats}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setSeats(Math.min(trip.availableSeats, seats + 1))}
                  disabled={seats >= trip.availableSeats}
                >
                  +
                </Button>
                <div className="ml-auto text-right">
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-2xl font-medium text-primary">{totalPrice} AED</p>
                </div>
              </div>
            </div>

            <div>
              <Label>Message to Driver (Optional)</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself or ask any questions..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : `Request to Join (${totalPrice} AED)`}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
