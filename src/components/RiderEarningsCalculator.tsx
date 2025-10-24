import { useState } from 'react';
import { TrendingUp, DollarSign, Users, Calculator, Info, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface EarningsBreakdown {
  tripCost: number;
  passengers: number;
  totalRevenue: number;
  platformFee: number;
  netEarnings: number;
  costCoverage: number;
  profitMargin: number;
}

export function RiderEarningsCalculator() {
  const [distance, setDistance] = useState(100);
  const [fuelCostPerKm, setFuelCostPerKm] = useState(0.5);
  const [passengers, setPassengers] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(25);

  const calculateEarnings = (): EarningsBreakdown => {
    const tripCost = distance * fuelCostPerKm + 20; // Base trip cost + fixed costs
    const totalRevenue = pricePerSeat * passengers;
    const platformFee = totalRevenue * 0.10; // 10% platform fee
    const netEarnings = totalRevenue - platformFee;
    const costCoverage = (netEarnings / tripCost) * 100;
    const profitMargin = netEarnings - tripCost;

    return {
      tripCost,
      passengers,
      totalRevenue,
      platformFee,
      netEarnings,
      costCoverage,
      profitMargin,
    };
  };

  const earnings = calculateEarnings();
  const suggestedPrice = Math.ceil((distance * fuelCostPerKm + 20) / 3 / 5) * 5; // Round to nearest 5

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Calculator className="size-4 mr-2" />
          Calculate Your Earnings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            Rider Earnings Calculator
          </DialogTitle>
          <DialogDescription>
            Estimate your potential earnings and optimize your ride pricing
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <Label className="flex items-center justify-between">
                Trip Distance (km)
                <span className="text-sm text-muted-foreground">{distance} km</span>
              </Label>
              <Slider
                value={[distance]}
                onValueChange={(value) => setDistance(value[0])}
                min={10}
                max={500}
                step={10}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="flex items-center justify-between">
                Fuel Cost per km (AED)
                <span className="text-sm text-muted-foreground">{fuelCostPerKm.toFixed(2)} AED</span>
              </Label>
              <Slider
                value={[fuelCostPerKm * 10]}
                onValueChange={(value) => setFuelCostPerKm(value[0] / 10)}
                min={3}
                max={15}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="flex items-center justify-between">
                Number of Passengers
                <span className="text-sm text-muted-foreground">{passengers} passengers</span>
              </Label>
              <Slider
                value={[passengers]}
                onValueChange={(value) => setPassengers(value[0])}
                min={1}
                max={4}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="pricePerSeat">Price per Seat (AED)</Label>
              <Input
                id="pricePerSeat"
                type="number"
                value={pricePerSeat}
                onChange={(e) => setPricePerSeat(Number(e.target.value))}
                min={10}
                step={5}
              />
              <div className="flex items-center gap-2 mt-2">
                <Info className="size-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Suggested: {suggestedPrice} AED per seat
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto text-xs"
                  onClick={() => setPricePerSeat(suggestedPrice)}
                >
                  Use Suggested
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Net Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-primary mb-2">
                  {earnings.netEarnings.toFixed(2)} AED
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className={
                    earnings.profitMargin > 0 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }>
                    {earnings.profitMargin > 0 ? '+' : ''}
                    {earnings.profitMargin.toFixed(2)} AED profit
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <span className="font-medium">{earnings.totalRevenue.toFixed(2)} AED</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-muted-foreground">Platform Fee (10%)</span>
                <span className="font-medium text-red-600">-{earnings.platformFee.toFixed(2)} AED</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-muted-foreground">Trip Cost (est.)</span>
                <span className="font-medium text-red-600">-{earnings.tripCost.toFixed(2)} AED</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                <span className="font-medium">Cost Coverage</span>
                <span className="font-medium text-primary">{earnings.costCoverage.toFixed(0)}%</span>
              </div>
            </div>

            {/* Insights */}
            {earnings.costCoverage >= 100 && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="size-4 text-green-600" />
                <AlertDescription className="text-green-900 text-sm">
                  <strong>Great pricing!</strong> You'll cover all costs and make a profit.
                </AlertDescription>
              </Alert>
            )}

            {earnings.costCoverage >= 70 && earnings.costCoverage < 100 && (
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="size-4 text-blue-600" />
                <AlertDescription className="text-blue-900 text-sm">
                  <strong>Good balance!</strong> Consider increasing price by {Math.ceil((100 - earnings.costCoverage) / earnings.costCoverage * pricePerSeat)} AED for profit.
                </AlertDescription>
              </Alert>
            )}

            {earnings.costCoverage < 70 && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <Info className="size-4 text-yellow-600" />
                <AlertDescription className="text-yellow-900 text-sm">
                  <strong>Low coverage.</strong> Increase price or add more passengers to improve profitability.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="mb-3 flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            Tips to Maximize Earnings
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Fill all available seats for maximum revenue</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Offer return trips (Raje3) to attract more passengers</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Price competitively but don't undervalue your service</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Maintain high ratings to attract premium passengers</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick earnings badge component for trip cards
export function EarningsBadge({ 
  pricePerSeat, 
  passengers, 
  estimatedCost 
}: { 
  pricePerSeat: number; 
  passengers: number; 
  estimatedCost: number;
}) {
  const totalRevenue = pricePerSeat * passengers;
  const platformFee = totalRevenue * 0.10;
  const netEarnings = totalRevenue - platformFee;
  const profit = netEarnings - estimatedCost;
  const profitPercentage = (profit / estimatedCost) * 100;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
      <DollarSign className="size-4 text-primary" />
      <div className="text-sm">
        <span className="font-medium text-primary">{netEarnings.toFixed(0)} AED</span>
        {profit > 0 && (
          <span className="text-xs text-green-600 ml-2">
            +{profitPercentage.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
}
