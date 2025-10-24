import { useState } from 'react';
import { usePayment } from '../contexts/PaymentContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Shield, 
  Lock, 
  CheckCircle2,
  ArrowDownToLine,
  Info,
  Banknote
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { PaymentMethodComparison } from './PaymentMethodComparison';

export function Payments() {
  const { 
    wallet, 
    cards, 
    transactions, 
    preferredPaymentMethod,
    setPreferredPaymentMethod,
    topUpWallet, 
    addCard, 
    removeCard, 
    setDefaultCard, 
    requestRefund,
    withdrawFromWallet 
  } = usePayment();
  const { t } = useLanguage();
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false);

  // Calculate statistics
  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.createdAt);
    const now = new Date();
    return transactionDate.getMonth() === now.getMonth() && 
           transactionDate.getFullYear() === now.getFullYear();
  });

  const monthlySpent = thisMonthTransactions
    .filter(t => t.type === 'trip_payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyEarned = thisMonthTransactions
    .filter(t => t.type === 'earnings')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with Security Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3">
            Payments & Wallet
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
              <Shield className="size-3" />
              Secure & PCI Compliant
            </Badge>
          </h1>
          <p className="text-muted-foreground">Manage your transactions and balance with bank-level security</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={topUpDialogOpen} onOpenChange={setTopUpDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="size-4 mr-2" />
                Add Funds
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lock className="size-5 text-primary" />
                  Secure Wallet Top-Up
                </DialogTitle>
                <DialogDescription>
                  Add funds using your preferred payment method. All transactions are encrypted and secure.
                </DialogDescription>
              </DialogHeader>
              <TopUpForm onSuccess={() => setTopUpDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowDownToLine className="size-4 mr-2" />
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
                <DialogDescription>Transfer money from your Wassel wallet to your bank account</DialogDescription>
              </DialogHeader>
              <WithdrawForm onSuccess={() => setWithdrawDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Wallet Balance & Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="size-5 text-primary" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl text-primary">
                {wallet.amount.toFixed(2)} <span className="text-xl">{wallet.currency}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setTopUpDialogOpen(true)}
                >
                  <Plus className="size-4 mr-1" />
                  Add Funds
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setWithdrawDialogOpen(true)}
                  disabled={wallet.amount < 10}
                >
                  <ArrowDownToLine className="size-4 mr-1" />
                  Withdraw
                </Button>
              </div>
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="size-4 text-blue-600" />
                <AlertDescription className="text-blue-900 text-sm">
                  Your wallet funds are secure and can be used for instant trip payments
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="size-5 text-red-500" />
              Monthly Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl">{monthlySpent.toFixed(2)} AED</div>
              <p className="text-sm text-muted-foreground">
                {thisMonthTransactions.filter(t => t.type === 'trip_payment').length} trips this month
              </p>
              <Badge variant="outline" className="mt-2">
                Avg: {thisMonthTransactions.length > 0 ? (monthlySpent / thisMonthTransactions.filter(t => t.type === 'trip_payment').length).toFixed(2) : '0.00'} AED/trip
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-green-500" />
              Monthly Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl text-green-700">{monthlyEarned.toFixed(2)} AED</div>
              <p className="text-sm text-muted-foreground">From ride sharing this month</p>
              <Badge variant="outline" className="mt-2 bg-green-100 text-green-700 border-green-200">
                Keep it up! 🎉
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your cards and payment preferences</CardDescription>
            </div>
            <Dialog open={addCardDialogOpen} onOpenChange={setAddCardDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="size-4 mr-2" />
                  Add Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Lock className="size-5 text-primary" />
                    Add Payment Card
                  </DialogTitle>
                  <DialogDescription>
                    Your card details are encrypted and stored securely
                  </DialogDescription>
                </DialogHeader>
                <AddCardForm onSuccess={() => setAddCardDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Saved Cards */}
          {cards.length > 0 && (
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                Saved Cards
                <Badge variant="outline">{cards.length}</Badge>
              </h4>
              <div className="space-y-3">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="size-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{card.brand} •••• {card.last4}</p>
                        <p className="text-sm text-muted-foreground">
                          {card.holderName && `${card.holderName} • `}
                          Expires {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {card.isDefault && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          <CheckCircle2 className="size-3 mr-1" />
                          Default
                        </Badge>
                      )}
                      {!card.isDefault && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDefaultCard(card.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeCard(card.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supported Payment Methods */}
          <div className="pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <h4 className="flex items-center gap-2">
                Supported Payment Methods
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>All payment methods are secure and PCI-DSS compliant</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h4>
              <PaymentMethodComparison />
            </div>

            {/* Payment Method Grid with Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <PaymentMethodCard
                name="Wallet"
                description="Instant payment"
                icon={<Wallet className="size-5" />}
                badge="Fastest"
                color="primary"
              />
              <PaymentMethodCard
                name="Cash"
                description="Pay on delivery"
                icon={<Banknote className="size-5" />}
                badge="Flexible"
                color="secondary"
              />
              <PaymentMethodCard
                name="Tabby"
                description="Split in 4 payments"
                badge="BNPL"
                color="accent"
              />
              <PaymentMethodCard
                name="Tamara"
                description="Split in 3 payments"
                badge="BNPL"
                color="accent"
              />
              <PaymentMethodCard
                name="Mada"
                description="Saudi local cards"
                badge="Local"
              />
              <PaymentMethodCard
                name="Visa"
                description="Credit & Debit"
              />
              <PaymentMethodCard
                name="Mastercard"
                description="Credit & Debit"
              />
              <PaymentMethodCard
                name="Amex"
                description="American Express"
              />
              <PaymentMethodCard
                name="Apple Pay"
                description="One-tap payment"
                badge="Quick"
              />
              <PaymentMethodCard
                name="PayPal"
                description="Digital wallet"
              />
            </div>

            {/* Security Features */}
            <Alert className="mt-6 bg-green-50 border-green-200">
              <Shield className="size-4 text-green-600" />
              <AlertDescription className="text-green-900">
                <strong>Your Security is Our Priority:</strong> All transactions are encrypted with 256-bit SSL. 
                We never store your full card details and comply with international PCI-DSS standards.
              </AlertDescription>
            </Alert>

            {/* Cash Payment Info */}
            <Alert className="mt-3">
              <Info className="size-4" />
              <AlertDescription>
                <strong>Cash Payments:</strong> Available for trips up to 500 AED. 
                Riders will receive cash directly from passengers at the end of the trip. 
                Please ensure you have exact change when possible.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent payments and earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="trip_payment">Payments</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="refund">Refunds</TabsTrigger>
              <TabsTrigger value="wallet_topup">Top-ups</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-6">
              <TransactionList transactions={transactions} />
            </TabsContent>

            <TabsContent value="trip_payment" className="space-y-3 mt-6">
              <TransactionList 
                transactions={transactions.filter(t => t.type === 'trip_payment')} 
              />
            </TabsContent>

            <TabsContent value="earnings" className="space-y-3 mt-6">
              <TransactionList 
                transactions={transactions.filter(t => t.type === 'earnings')} 
              />
            </TabsContent>

            <TabsContent value="refund" className="space-y-3 mt-6">
              <TransactionList 
                transactions={transactions.filter(t => t.type === 'refund')} 
              />
            </TabsContent>

            <TabsContent value="wallet_topup" className="space-y-3 mt-6">
              <TransactionList 
                transactions={transactions.filter(t => t.type === 'wallet_topup')} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentMethodCard({ 
  name, 
  description, 
  icon, 
  badge, 
  color = 'default' 
}: { 
  name: string; 
  description: string; 
  icon?: React.ReactNode;
  badge?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'default';
}) {
  const colorClasses = {
    primary: 'border-primary/30 hover:border-primary bg-primary/5',
    secondary: 'border-secondary/30 hover:border-secondary bg-secondary/5',
    accent: 'border-accent/30 hover:border-accent bg-accent/5',
    default: 'border-gray-200 hover:border-primary/50',
  };

  return (
    <div className={`p-4 border rounded-lg transition-all cursor-pointer ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-2">
        {icon && <div className="text-primary">{icon}</div>}
        {badge && (
          <Badge variant="outline" className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      <p className="font-medium">{name}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function TransactionList({ transactions }: { transactions: any[] }) {
  const { requestRefund } = usePayment();

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <AlertCircle className="size-12 mx-auto mb-4 opacity-50" />
        <p>No transactions found</p>
        <p className="text-sm mt-2">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`size-10 rounded-full flex items-center justify-center ${
              transaction.type === 'refund' || transaction.type === 'wallet_topup' || transaction.type === 'earnings'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {transaction.type === 'refund' || transaction.type === 'wallet_topup' || transaction.type === 'earnings' ? (
                <TrendingUp className="size-5" />
              ) : (
                <TrendingDown className="size-5" />
              )}
            </div>
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(transaction.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} • <span className="capitalize">{transaction.method.replace('_', ' ')}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-medium ${
              transaction.type === 'refund' || transaction.type === 'wallet_topup' || transaction.type === 'earnings'
                ? 'text-green-700' 
                : 'text-red-700'
            }`}>
              {transaction.type === 'refund' || transaction.type === 'wallet_topup' || transaction.type === 'earnings' ? '+' : '-'}
              {transaction.amount.toFixed(2)} {transaction.currency}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline" 
                className={
                  transaction.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                  transaction.status === 'pending' || transaction.status === 'processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  transaction.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-gray-50 text-gray-700 border-gray-200'
                }
              >
                {transaction.status}
              </Badge>
              {transaction.type === 'trip_payment' && transaction.status === 'completed' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => requestRefund(transaction.id, 'Trip cancelled')}
                >
                  Request Refund
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TopUpForm({ onSuccess }: { onSuccess: () => void }) {
  const { topUpWallet, validatePaymentMethod } = usePayment();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'card' | 'tabby' | 'tamara' | 'mada' | 'visa' | 'mastercard' | 'amex' | 'apple_pay' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);

    // Validate
    const validation = validatePaymentMethod(method, amountNum);
    if (!validation.valid) {
      return;
    }

    setIsProcessing(true);
    try {
      await topUpWallet(amountNum, method);
      onSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Quick Amount</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {quickAmounts.map((quickAmount) => (
            <Button
              key={quickAmount}
              type="button"
              variant={amount === quickAmount.toString() ? 'default' : 'outline'}
              onClick={() => setAmount(quickAmount.toString())}
            >
              {quickAmount} AED
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Custom Amount (AED)</Label>
        <Input
          type="number"
          min="10"
          step="10"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">Minimum: 10 AED</p>
      </div>

      <div>
        <Label>Payment Method</Label>
        <RadioGroup value={method} onValueChange={(value: any) => setMethod(value)} className="mt-3 space-y-3">
          <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4" />
                  <span>Credit/Debit Card</span>
                </div>
                <Badge variant="outline" className="text-xs">Instant</Badge>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="apple_pay" id="apple_pay" />
            <Label htmlFor="apple_pay" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🍎</span>
                  <span>Apple Pay</span>
                </div>
                <Badge variant="outline" className="text-xs">Quick</Badge>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <span>PayPal</span>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="tabby" id="tabby" />
            <Label htmlFor="tabby" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <span>Tabby (Split in 4)</span>
                <Badge variant="outline" className="text-xs bg-accent/10 text-accent">BNPL</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Min. 50 AED</p>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="tamara" id="tamara" />
            <Label htmlFor="tamara" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <span>Tamara (Split in 3)</span>
                <Badge variant="outline" className="text-xs bg-accent/10 text-accent">BNPL</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Min. 50 AED</p>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Lock className="size-4 text-blue-600" />
        <AlertDescription className="text-blue-900 text-sm">
          Secured by 256-bit encryption. Funds will be added instantly after payment confirmation.
        </AlertDescription>
      </Alert>

      <Button type="submit" className="w-full" disabled={isProcessing || !amount}>
        {isProcessing ? 'Processing...' : `Add ${amount || '0'} AED to Wallet`}
      </Button>
    </form>
  );
}

function WithdrawForm({ onSuccess }: { onSuccess: () => void }) {
  const { wallet, withdrawFromWallet } = usePayment();
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await withdrawFromWallet(parseFloat(amount), destination);
      onSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  const maxWithdraw = wallet.amount;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert>
        <Info className="size-4" />
        <AlertDescription>
          Available balance: <strong>{wallet.amount.toFixed(2)} AED</strong>
        </AlertDescription>
      </Alert>

      <div>
        <Label>Amount (AED)</Label>
        <Input
          type="number"
          min="10"
          max={maxWithdraw}
          step="10"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Min: 10 AED • Max: {maxWithdraw.toFixed(2)} AED
        </p>
      </div>

      <div>
        <Label>Bank Account / IBAN</Label>
        <Input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter your IBAN or account number"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Withdrawals typically take 1-3 business days
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isProcessing || !amount || !destination || parseFloat(amount) > maxWithdraw}>
        {isProcessing ? 'Processing...' : `Withdraw ${amount || '0'} AED`}
      </Button>
    </form>
  );
}

function AddCardForm({ onSuccess }: { onSuccess: () => void }) {
  const { addCard } = usePayment();
  const [formData, setFormData] = useState({
    cardNumber: '',
    holderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Detect card brand from number
  const detectCardBrand = (number: string): 'visa' | 'mastercard' | 'amex' | 'mada' => {
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'mada';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      await addCard({
        last4: formData.cardNumber.slice(-4),
        brand: detectCardBrand(formData.cardNumber),
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear),
        isDefault: formData.isDefault,
        holderName: formData.holderName,
      });
      
      onSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert className="bg-green-50 border-green-200">
        <Shield className="size-4 text-green-600" />
        <AlertDescription className="text-green-900 text-sm">
          Your card details are encrypted and never stored in plain text
        </AlertDescription>
      </Alert>

      <div>
        <Label>Cardholder Name</Label>
        <Input
          type="text"
          value={formData.holderName}
          onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
          placeholder="Ahmed Al-Mansouri"
          required
        />
      </div>

      <div>
        <Label>Card Number</Label>
        <Input
          type="text"
          maxLength={16}
          value={formData.cardNumber}
          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, '') })}
          placeholder="1234 5678 9012 3456"
          required
        />
        {formData.cardNumber.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1 capitalize">
            Detected: {detectCardBrand(formData.cardNumber)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Month</Label>
          <Input
            type="text"
            maxLength={2}
            value={formData.expiryMonth}
            onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value.replace(/\D/g, '') })}
            placeholder="MM"
            required
          />
        </div>
        <div>
          <Label>Year</Label>
          <Input
            type="text"
            maxLength={4}
            value={formData.expiryYear}
            onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value.replace(/\D/g, '') })}
            placeholder="YYYY"
            required
          />
        </div>
        <div>
          <Label>CVV</Label>
          <Input
            type="password"
            maxLength={4}
            value={formData.cvv}
            onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
            placeholder="123"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="default"
          checked={formData.isDefault}
          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="default" className="cursor-pointer">
          Set as default payment method
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? 'Adding Card...' : 'Add Card Securely'}
      </Button>
    </form>
  );
}
