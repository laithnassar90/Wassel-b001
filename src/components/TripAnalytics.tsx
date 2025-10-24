import { useTrips } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MapPin,
  Calendar,
  Clock,
  Award,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function TripAnalytics() {
  const { trips, getUserTrips } = useTrips();
  const { user } = useAuth();
  const { transactions } = usePayment();

  if (!user) return null;

  const userTripsAsDriver = getUserTrips(user.id, 'driver');
  const userTripsAsPassenger = getUserTrips(user.id, 'passenger');

  // Calculate statistics
  const totalTripsOffered = userTripsAsDriver.length;
  const totalTripsTaken = userTripsAsPassenger.length;
  const completedTrips = [...userTripsAsDriver, ...userTripsAsPassenger].filter(t => t.status === 'completed').length;
  
  const totalEarned = transactions
    .filter(t => t.type === 'trip_payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'trip_payment')
    .reduce((sum, t) => sum + t.amount, 0);

  // Monthly trip data
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      month: date.toLocaleDateString('en', { month: 'short' }),
      offered: Math.floor(Math.random() * 10),
      taken: Math.floor(Math.random() * 8),
    };
  });

  // Popular routes
  const popularRoutes = [
    { route: 'Dubai → Abu Dhabi', trips: 15, percentage: 35 },
    { route: 'Sharjah → Dubai', trips: 12, percentage: 28 },
    { route: 'Ajman → Sharjah', trips: 8, percentage: 19 },
    { route: 'Abu Dhabi → Dubai', trips: 5, percentage: 12 },
    { route: 'Others', trips: 3, percentage: 6 },
  ];

  // Trip type distribution
  const tripTypeData = [
    { name: 'Wasel (One-way)', value: 65, color: '#008080' },
    { name: 'Raje3 (Return)', value: 35, color: '#607D4B' },
  ];

  // Weekly activity
  const weeklyActivity = [
    { day: 'Mon', trips: 3 },
    { day: 'Tue', trips: 5 },
    { day: 'Wed', trips: 4 },
    { day: 'Thu', trips: 6 },
    { day: 'Fri', trips: 2 },
    { day: 'Sat', trips: 7 },
    { day: 'Sun', trips: 4 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium">Trip Analytics</h2>
        <p className="text-muted-foreground">Insights and statistics about your trips</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="size-4 text-green-600" />
              Trips Offered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium">{totalTripsOffered}</div>
            <p className="text-xs text-muted-foreground mt-1">As driver</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="size-4 text-blue-600" />
              Trips Taken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium">{totalTripsTaken}</div>
            <p className="text-xs text-muted-foreground mt-1">As passenger</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="size-4 text-green-600" />
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium">{totalEarned} AED</div>
            <p className="text-xs text-muted-foreground mt-1">From trips offered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="size-4 text-yellow-600" />
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium">{user.rating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">{completedTrips} completed trips</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Trip History (Last 6 Months)</CardTitle>
                <CardDescription>Offered vs Taken trips</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={last6Months}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="offered" stroke="#008080" strokeWidth={2} name="Offered" />
                    <Line type="monotone" dataKey="taken" stroke="#607D4B" strokeWidth={2} name="Taken" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trip Type Distribution</CardTitle>
                <CardDescription>Wasel vs Raje3 trips</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tripTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tripTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Routes</CardTitle>
              <CardDescription>Your frequently traveled routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularRoutes.map((route, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-primary" />
                        <span className="font-medium">{route.route}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{route.trips} trips</span>
                        <Badge variant="outline">{route.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${route.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Trips by day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="trips" fill="#008080" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Peak Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium">Saturday</div>
                <p className="text-xs text-muted-foreground">Most active day</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Trip Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium">1.5 hrs</div>
                <p className="text-xs text-muted-foreground">Average time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium text-green-600">124 kg</div>
                <p className="text-xs text-muted-foreground">By carpooling</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings</CardTitle>
                <CardDescription>Revenue from trips offered</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={last6Months.map(m => ({ ...m, earnings: Math.random() * 500 + 200 }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="earnings" fill="#008080" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Gross Earnings</span>
                  <span className="text-lg font-medium text-green-700">{totalEarned} AED</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Total Spent</span>
                  <span className="text-lg font-medium text-red-700">{totalSpent} AED</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="font-medium">Net Balance</span>
                  <span className="text-lg font-medium text-primary">{totalEarned - totalSpent} AED</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
