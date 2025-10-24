import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  X, 
  ChevronRight, 
  User, 
  Search, 
  Plus, 
  MessageCircle, 
  Wallet,
  Shield,
  Star,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

export function UXEnhancements() {
  const location = useLocation();
  const currentPage = location.pathname.split('/').pop() || 'dashboard';
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showContextualHelp, setShowContextualHelp] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Check if user is new (in real app, check from user profile)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('wassel_onboarding_completed');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('wassel_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  return (
    <>
      {/* Contextual Help for Each Page */}
      {showContextualHelp && <ContextualHelp currentPage={currentPage} onClose={() => setShowContextualHelp(false)} />}
      
      {/* Interactive Onboarding */}
      <OnboardingDialog 
        open={showOnboarding} 
        onComplete={completeOnboarding}
        step={onboardingStep}
        setStep={setOnboardingStep}
      />

      {/* Help Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 rounded-full size-12 shadow-lg z-50 border-2 border-primary/20 hover:border-primary"
        onClick={() => setShowOnboarding(true)}
      >
        <HelpCircle className="size-5 text-primary" />
      </Button>
    </>
  );
}

function ContextualHelp({ 
  currentPage, 
  onClose
}: { 
  currentPage: string; 
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const helpContent = getHelpContent(currentPage);
  
  if (!helpContent) return null;

  return (
    <Alert className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {helpContent.icon}
            <h4 className="font-medium">{helpContent.title}</h4>
          </div>
          <AlertDescription className="text-sm">
            {helpContent.description}
          </AlertDescription>
          {helpContent.tips && (
            <ul className="mt-3 space-y-1 text-sm">
              {helpContent.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight className="size-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}
          {helpContent.nextAction && (
            <Button 
              size="sm" 
              className="mt-3"
              onClick={() => {
                const routeMap: Record<string, string> = {
                  'dashboard': '/app/dashboard',
                  'find-ride': '/app/find-ride',
                  'offer-ride': '/app/offer-ride',
                  'my-trips': '/app/trips',
                  'messages': '/app/messages',
                  'payments': '/app/payments',
                  'settings': '/app/settings',
                };
                navigate(routeMap[helpContent.nextAction!.page] || '/app/dashboard');
              }}
            >
              {helpContent.nextAction.label}
              <ArrowRight className="size-4 ml-2" />
            </Button>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
          <X className="size-4" />
        </Button>
      </div>
    </Alert>
  );
}

function OnboardingDialog({ 
  open, 
  onComplete,
  step,
  setStep
}: { 
  open: boolean; 
  onComplete: () => void;
  step: number;
  setStep: (step: number) => void;
}) {
  const steps = [
    {
      title: 'Welcome to Wassel! 🚗',
      description: 'The Middle East\'s smartest ride-sharing platform',
      content: (
        <div className="space-y-4">
          <p>Wassel connects riders and passengers for safe, affordable, and eco-friendly travel across cities.</p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-6">
                <div className="size-12 bg-primary rounded-xl flex items-center justify-center mb-3">
                  <Search className="size-6 text-white" />
                </div>
                <h4 className="mb-2">Find a Ride</h4>
                <p className="text-sm text-muted-foreground">
                  Search and join rides to save money on your trips
                </p>
              </CardContent>
            </Card>
            <Card className="border-secondary/30 bg-secondary/5">
              <CardContent className="pt-6">
                <div className="size-12 bg-secondary rounded-xl flex items-center justify-center mb-3">
                  <Plus className="size-6 text-white" />
                </div>
                <h4 className="mb-2">Offer a Ride</h4>
                <p className="text-sm text-muted-foreground">
                  Share your journey and earn money to cover costs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: 'Trip Types: Wasel & Raje3',
      description: 'Understanding our unique trip classification',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary">Wasel (واصل)</Badge>
              <span className="font-medium">One-Way Trip</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A single journey from point A to point B. Perfect for daily commutes, airport transfers, or one-time trips.
            </p>
          </div>
          <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-secondary">Raje3 (راجع)</Badge>
              <span className="font-medium">Return Trip</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A round trip with a return journey. Ideal for weekend getaways, business trips, or when you need a ride back.
            </p>
          </div>
          <Alert>
            <CheckCircle2 className="size-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Offering return trips (Raje3) can help you find more passengers and maximize your earnings!
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      title: 'Safety & Security First 🛡️',
      description: 'Your safety is our top priority',
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="size-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Verified Profiles</h4>
                <p className="text-sm text-green-700 mt-1">
                  All users must verify their identity with ID and phone number
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Star className="size-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Rating System</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Rate and review riders/passengers to build trust in the community
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <MessageCircle className="size-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">SOS Emergency</h4>
                <p className="text-sm text-red-700 mt-1">
                  One-tap emergency assistance available 24/7 during trips
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Flexible Payment Options 💳',
      description: 'Pay your way with secure, PCI-compliant processing',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg text-center">
              <Wallet className="size-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Wallet</p>
              <p className="text-xs text-muted-foreground">Instant payment</p>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <span className="text-3xl mb-2 block">💳</span>
              <p className="font-medium">Cards</p>
              <p className="text-xs text-muted-foreground">Visa, Mastercard, Mada</p>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <span className="text-3xl mb-2 block">📱</span>
              <p className="font-medium">BNPL</p>
              <p className="text-xs text-muted-foreground">Tabby, Tamara</p>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <span className="text-3xl mb-2 block">💵</span>
              <p className="font-medium">Cash</p>
              <p className="text-xs text-muted-foreground">Pay on delivery</p>
            </div>
          </div>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="size-4 text-green-600" />
            <AlertDescription className="text-green-900 text-sm">
              All transactions are encrypted with 256-bit SSL and PCI-DSS compliant for maximum security
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      title: 'Start Your Journey! 🚀',
      description: 'You\'re all set to use Wassel',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-lg text-center">
            <CheckCircle2 className="size-16 text-primary mx-auto mb-4" />
            <h3 className="mb-2">You\'re Ready to Go!</h3>
            <p className="text-muted-foreground mb-4">
              Complete your profile to start finding or offering rides
            </p>
            <div className="grid gap-2 max-w-sm mx-auto">
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">✓ Account Created</span>
                <CheckCircle2 className="size-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">Complete Profile</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">Verify Identity</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">Add Payment Method</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          <Alert>
            <TrendingUp className="size-4" />
            <AlertDescription>
              <strong>Quick Start:</strong> Riders earn an average of 30-40% of trip costs by sharing rides!
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
  ];

  const currentStepData = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription>{currentStepData.description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Progress value={progress} className="mb-6" />
          {currentStepData.content}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Step {step + 1} of {steps.length}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next
                <ChevronRight className="size-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                Get Started
                <CheckCircle2 className="size-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getHelpContent(page: string) {
  const content: Record<string, any> = {
    dashboard: {
      icon: <TrendingUp className="size-5 text-primary" />,
      title: 'Your Dashboard',
      description: 'Welcome to your command center! Here you can quickly access all Wassel features and see your activity summary.',
      tips: [
        'Check your environmental impact - see how much CO₂ you\'ve saved',
        'View your upcoming trips and recent activity',
        'Quick actions to find or offer rides in seconds',
      ],
      nextAction: {
        label: 'Find a Ride',
        page: 'find-ride',
      },
    },
    'find-ride': {
      icon: <Search className="size-5 text-primary" />,
      title: 'Finding the Perfect Ride',
      description: 'Use our AI-powered search to find rides that match your schedule, route, and preferences.',
      tips: [
        'Be flexible with your time to find more options',
        'Check rider ratings and reviews before booking',
        'Book early for popular routes to secure your seat',
        'Use filters to find rides that match your preferences (gender, smoking, etc.)',
      ],
    },
    'offer-ride': {
      icon: <Plus className="size-5 text-secondary" />,
      title: 'Offering a Ride',
      description: 'Share your journey and earn money while helping others. Set your own prices and choose your passengers.',
      tips: [
        'Price competitively - riders earn 30-40% of trip costs on average',
        'Offer return trips (Raje3) to attract more passengers',
        'Be clear about your pickup points and any restrictions',
        'Respond quickly to booking requests to increase your acceptance rate',
      ],
      nextAction: {
        label: 'View My Trips',
        page: 'my-trips',
      },
    },
    'my-trips': {
      icon: <CheckCircle2 className="size-5 text-primary" />,
      title: 'Managing Your Trips',
      description: 'Track all your trips in one place. View upcoming journeys, past rides, and earnings.',
      tips: [
        'Keep your trip status updated to maintain a good reputation',
        'Cancel trips at least 24 hours in advance to avoid penalties',
        'Rate passengers/riders after each trip to help the community',
        'Use the chat feature to coordinate pickup details',
      ],
    },
    messages: {
      icon: <MessageCircle className="size-5 text-primary" />,
      title: 'Stay Connected',
      description: 'Communicate safely with riders and passengers through our secure in-app messaging.',
      tips: [
        'Share pickup locations and meeting points clearly',
        'Keep all communication within the app for safety',
        'Be polite and professional in all messages',
        'Report any inappropriate behavior immediately',
      ],
    },
    payments: {
      icon: <Wallet className="size-5 text-primary" />,
      title: 'Secure Payments',
      description: 'Manage your wallet, cards, and view all transactions. All payments are PCI-DSS compliant.',
      tips: [
        'Keep your wallet topped up for instant bookings',
        'Choose cash payments for flexibility (up to 500 AED)',
        'Use Buy Now Pay Later (Tabby/Tamara) for trips over 50 AED',
        'Withdraw your earnings anytime to your bank account',
      ],
    },
    settings: {
      icon: <User className="size-5 text-primary" />,
      title: 'Customize Your Experience',
      description: 'Personalize Wassel to match your preferences and keep your account secure.',
      tips: [
        'Complete your verification to unlock all features',
        'Set notification preferences to stay informed',
        'Update your privacy settings for maximum control',
        'Enable dark mode for comfortable night browsing',
      ],
    },
  };

  return content[page] || null;
}
