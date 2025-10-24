import { CheckCircle2, X, Info, Zap, Shield, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

interface PaymentMethod {
  name: string;
  instant: boolean;
  secure: boolean;
  fees: string;
  minAmount: string;
  maxAmount: string;
  features: string[];
  bestFor: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    name: 'Wassel Wallet',
    instant: true,
    secure: true,
    fees: '0%',
    minAmount: '1 AED',
    maxAmount: 'Unlimited',
    features: ['Instant payment', 'No fees', 'Auto-refunds', 'Quick top-up'],
    bestFor: 'Frequent travelers',
  },
  {
    name: 'Credit/Debit Card',
    instant: true,
    secure: true,
    fees: '2.5%',
    minAmount: '10 AED',
    maxAmount: 'Unlimited',
    features: ['Global acceptance', '3D Secure', 'Instant processing', 'Cashback eligible'],
    bestFor: 'One-time travelers',
  },
  {
    name: 'Tabby (BNPL)',
    instant: true,
    secure: true,
    fees: '0%',
    minAmount: '50 AED',
    maxAmount: '10,000 AED',
    features: ['Split in 4 payments', 'No interest', '0% fees', 'Credit building'],
    bestFor: 'Budget management',
  },
  {
    name: 'Tamara (BNPL)',
    instant: true,
    secure: true,
    fees: '0%',
    minAmount: '50 AED',
    maxAmount: '8,000 AED',
    features: ['Split in 3 payments', 'No interest', 'Flexible schedule', 'Fast approval'],
    bestFor: 'Flexible payments',
  },
  {
    name: 'Apple Pay',
    instant: true,
    secure: true,
    fees: '2.5%',
    minAmount: '10 AED',
    maxAmount: 'Unlimited',
    features: ['One-tap payment', 'Face ID/Touch ID', 'No card details shared', 'Tokenized'],
    bestFor: 'iOS users',
  },
  {
    name: 'PayPal',
    instant: true,
    secure: true,
    fees: '3.4%',
    minAmount: '10 AED',
    maxAmount: 'Unlimited',
    features: ['Buyer protection', 'Global wallet', 'Link bank/card', 'Easy refunds'],
    bestFor: 'International travelers',
  },
  {
    name: 'Mada',
    instant: true,
    secure: true,
    fees: '2.0%',
    minAmount: '10 AED',
    maxAmount: 'Unlimited',
    features: ['Saudi local network', 'Wide acceptance', 'Low fees', 'Instant verification'],
    bestFor: 'Saudi residents',
  },
  {
    name: 'Cash',
    instant: false,
    secure: false,
    fees: '0%',
    minAmount: '10 AED',
    maxAmount: '500 AED',
    features: ['No online payment', 'Pay driver directly', 'No fees', 'Traditional'],
    bestFor: 'Those without cards',
  },
];

export function PaymentMethodComparison() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="size-4 mr-2" />
          Compare Payment Methods
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Methods Comparison</DialogTitle>
          <DialogDescription>
            Choose the payment method that best fits your needs
          </DialogDescription>
        </DialogHeader>

        {/* Quick Feature Comparison Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead className="text-center">Instant</TableHead>
                <TableHead className="text-center">Secure</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Min Amount</TableHead>
                <TableHead>Max Amount</TableHead>
                <TableHead>Best For</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentMethods.map((method) => (
                <TableRow key={method.name}>
                  <TableCell className="font-medium">{method.name}</TableCell>
                  <TableCell className="text-center">
                    {method.instant ? (
                      <CheckCircle2 className="size-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="size-5 text-red-500 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {method.secure ? (
                      <Shield className="size-5 text-green-600 mx-auto" />
                    ) : (
                      <Info className="size-5 text-yellow-600 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={method.fees === '0%' ? 'outline' : 'secondary'} className={method.fees === '0%' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                      {method.fees}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{method.minAmount}</TableCell>
                  <TableCell className="text-sm">{method.maxAmount}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{method.bestFor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Detailed Feature Cards */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <Card key={method.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  {method.name}
                  {method.fees === '0%' && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      No Fees
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm">{method.bestFor}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing</span>
                    <Badge variant="outline" className={method.instant ? 'bg-blue-50 text-blue-700' : 'bg-gray-50'}>
                      {method.instant ? (
                        <><Zap className="size-3 mr-1" /> Instant</>
                      ) : (
                        <><Clock className="size-3 mr-1" /> Manual</>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fees</span>
                    <span className="font-medium">{method.fees}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Limits</span>
                    <span className="font-medium">{method.minAmount} - {method.maxAmount}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium mb-2">Key Features:</p>
                    <ul className="space-y-1">
                      {method.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="size-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-6 space-y-3">
          <h4 className="font-medium">💡 Our Recommendations:</h4>
          <div className="grid gap-3">
            <Card className="bg-primary/5 border-primary/30">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="size-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Best Overall: Wassel Wallet</h5>
                    <p className="text-sm text-muted-foreground">
                      Zero fees, instant payments, and auto-refunds make it perfect for regular users. Top up once and enjoy seamless transactions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="size-4 text-green-700" />
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Best for Budget: Tabby or Tamara</h5>
                    <p className="text-sm text-muted-foreground">
                      Split larger trip costs into interest-free installments. Perfect for weekend getaways or long-distance travel.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                    <Shield className="size-4 text-blue-700" />
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Most Secure: Apple Pay or PayPal</h5>
                    <p className="text-sm text-muted-foreground">
                      Tokenized payments mean your card details are never shared. Excellent buyer protection and dispute resolution.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
