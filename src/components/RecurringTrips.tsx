import { useState } from 'react';
import { useTrips } from '../contexts/TripContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Repeat,
  Pause,
  Play,
  Trash2,
  Edit
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface RecurringTrip {
  id: string;
  from: string;
  to: string;
  departureTime: string; // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
  pricePerSeat: number;
  seats: number;
  isActive: boolean;
  createdAt: string;
  nextOccurrence?: string;
}

export function RecurringTrips() {
  const { t } = useLanguage();
  const [recurringTrips, setRecurringTrips] = useState<RecurringTrip[]>([
    {
      id: '1',
      from: 'Dubai',
      to: 'Abu Dhabi',
      departureTime: '08:00',
      days: [1, 2, 3, 4, 5], // Monday to Friday
      pricePerSeat: 50,
      seats: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
      nextOccurrence: '2025-10-13T08:00:00',
    },
  ]);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const toggleTripStatus = (id: string) => {
    setRecurringTrips(prev =>
      prev.map(trip =>
        trip.id === id ? { ...trip, isActive: !trip.isActive } : trip
      )
    );
    toast.success('Recurring trip updated');
  };

  const deleteTrip = (id: string) => {
    setRecurringTrips(prev => prev.filter(trip => trip.id !== id));
    toast.success('Recurring trip deleted');
  };

  const getDayNames = (days: number[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(d => dayNames[d]).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Recurring Trips</h2>
          <p className="text-muted-foreground">Set up trips that repeat on a schedule</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Repeat className="size-4 mr-2" />
              Create Recurring Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Recurring Trip</DialogTitle>
              <DialogDescription>
                Schedule a trip that repeats automatically
              </DialogDescription>
            </DialogHeader>
            <CreateRecurringTripForm
              onSave={(trip) => {
                setRecurringTrips(prev => [...prev, trip]);
                setCreateDialogOpen(false);
                toast.success('Recurring trip created!');
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {recurringTrips.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Repeat className="size-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-medium mb-2">No Recurring Trips</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a recurring trip to save time on your regular commutes
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              Create Your First Recurring Trip
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {recurringTrips.map((trip) => (
            <Card key={trip.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Repeat className="size-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{trip.from} → {trip.to}</h3>
                          <Badge variant={trip.isActive ? 'default' : 'secondary'}>
                            {trip.isActive ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getDayNames(trip.days)} at {trip.departureTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">{trip.pricePerSeat} AED</p>
                        <p className="text-sm text-muted-foreground">{trip.seats} seats</p>
                      </div>
                    </div>

                    {trip.nextOccurrence && trip.isActive && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-4" />
                        <span>
                          Next trip: {new Date(trip.nextOccurrence).toLocaleDateString()} at {trip.departureTime}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTripStatus(trip.id)}
                      >
                        {trip.isActive ? (
                          <>
                            <Pause className="size-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="size-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="size-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTrip(trip.id)}
                      >
                        <Trash2 className="size-4 mr-2 text-destructive" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateRecurringTripForm({ onSave }: { onSave: (trip: RecurringTrip) => void }) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureTime: '08:00',
    pricePerSeat: 50,
    seats: 3,
    days: [] as number[],
  });

  const dayOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort(),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.from || !formData.to || formData.days.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const newTrip: RecurringTrip = {
      id: Math.random().toString(36).substr(2, 9),
      from: formData.from,
      to: formData.to,
      departureTime: formData.departureTime,
      days: formData.days,
      pricePerSeat: formData.pricePerSeat,
      seats: formData.seats,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    onSave(newTrip);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>From</Label>
        <Input
          value={formData.from}
          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
          placeholder="Starting location"
          required
        />
      </div>

      <div>
        <Label>To</Label>
        <Input
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          placeholder="Destination"
          required
        />
      </div>

      <div>
        <Label>Departure Time</Label>
        <Input
          type="time"
          value={formData.departureTime}
          onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Repeat on</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {dayOptions.map((day) => (
            <Button
              key={day.value}
              type="button"
              variant={formData.days.includes(day.value) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleDay(day.value)}
              className="text-xs"
            >
              {day.label.slice(0, 3)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price per Seat (AED)</Label>
          <Input
            type="number"
            min={1}
            value={formData.pricePerSeat}
            onChange={(e) => setFormData({ ...formData, pricePerSeat: parseInt(e.target.value) })}
            required
          />
        </div>

        <div>
          <Label>Available Seats</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={formData.seats}
            onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Recurring Trip
      </Button>
    </form>
  );
}
