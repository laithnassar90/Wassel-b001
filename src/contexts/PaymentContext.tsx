import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';

export type PaymentMethod = 
  | 'card' 
  | 'wallet' 
  | 'cash' 
  | 'tabby' 
  | 'tamara' 
  | 'mada' 
  | 'visa' 
  | 'mastercard' 
  | 'amex' 
  | 'apple_pay' 
  | 'paypal'
  | 'telr' 
  | 'paytabs';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type TransactionType = 'trip_payment' | 'refund' | 'wallet_topup' | 'split_payment' | 'withdrawal' | 'earnings';

export interface PaymentCard {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'mada';
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  holderName?: string;
}

export interface Transaction {
  id: string;
  tripId?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  description: string;
  from?: string;
  to?: string;
  createdAt: string;
  completedAt?: string;
}

export interface WalletBalance {
  amount: number;
  currency: string;
}

export interface SplitPaymentRequest {
  tripId: string;
  totalAmount: number;
  participants: Array<{
    userId: string;
    userName: string;
    amount: number;
    status: 'pending' | 'paid' | 'declined';
  }>;
}

interface PaymentContextType {
  wallet: WalletBalance;
  cards: PaymentCard[];
  transactions: Transaction[];
  preferredPaymentMethod: PaymentMethod | null;
  setPreferredPaymentMethod: (method: PaymentMethod) => void;
  addCard: (card: Omit<PaymentCard, 'id'>) => Promise<void>;
  removeCard: (cardId: string) => Promise<void>;
  setDefaultCard: (cardId: string) => Promise<void>;
  processPayment: (tripId: string, amount: number, method: PaymentMethod, metadata?: any) => Promise<Transaction>;
  requestRefund: (transactionId: string, reason: string) => Promise<void>;
  topUpWallet: (amount: number, method: PaymentMethod) => Promise<void>;
  withdrawFromWallet: (amount: number, destination: string) => Promise<void>;
  requestSplitPayment: (request: Omit<SplitPaymentRequest, 'id'>) => Promise<void>;
  getTransactionHistory: (filter?: { status?: PaymentStatus; type?: TransactionType }) => Transaction[];
  validatePaymentMethod: (method: PaymentMethod, amount: number) => { valid: boolean; message?: string };
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Mock data
const mockCards: PaymentCard[] = [
  {
    id: '1',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
    holderName: 'Ahmed Al-Mansouri',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    tripId: '1',
    type: 'trip_payment',
    amount: 50,
    currency: 'AED',
    method: 'card',
    status: 'completed',
    description: 'Trip to Abu Dhabi',
    from: 'Dubai Marina',
    to: 'Abu Dhabi Corniche',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '2',
    type: 'wallet_topup',
    amount: 200,
    currency: 'AED',
    method: 'card',
    status: 'completed',
    description: 'Wallet top-up',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletBalance>({ amount: 150, currency: 'AED' });
  const [cards, setCards] = useState<PaymentCard[]>(mockCards);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<PaymentMethod | null>('wallet');

  const addCard = async (cardData: Omit<PaymentCard, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCard: PaymentCard = {
      ...cardData,
      id: Math.random().toString(36).substr(2, 9),
    };

    // If this is set as default, unset others
    if (newCard.isDefault) {
      setCards(prev => prev.map(card => ({ ...card, isDefault: false })));
    }

    setCards(prev => [...prev, newCard]);
    toast.success('Card added successfully!');
  };

  const removeCard = async (cardId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCards(prev => prev.filter(card => card.id !== cardId));
    toast.success('Card removed');
  };

  const setDefaultCard = async (cardId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCards(prev => prev.map(card => ({
      ...card,
      isDefault: card.id === cardId,
    })));
    toast.success('Default card updated');
  };

  const validatePaymentMethod = (method: PaymentMethod, amount: number): { valid: boolean; message?: string } => {
    // Validate wallet balance
    if (method === 'wallet' && wallet.amount < amount) {
      return { valid: false, message: 'Insufficient wallet balance. Please top up or choose another payment method.' };
    }

    // Validate minimum amounts for BNPL services
    if ((method === 'tabby' || method === 'tamara') && amount < 50) {
      return { valid: false, message: `${method === 'tabby' ? 'Tabby' : 'Tamara'} requires a minimum purchase of 50 AED.` };
    }

    // Cash payment validation
    if (method === 'cash' && amount > 500) {
      return { valid: false, message: 'Cash payments are limited to 500 AED for security. Please choose another payment method.' };
    }

    return { valid: true };
  };

  const processPayment = async (tripId: string, amount: number, method: PaymentMethod, metadata?: any): Promise<Transaction> => {
    // Validate payment method
    const validation = validatePaymentMethod(method, amount);
    if (!validation.valid) {
      toast.error(validation.message);
      throw new Error(validation.message);
    }

    // Show processing toast
    toast.loading('Processing your payment securely...', { id: 'payment-processing' });
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate secure processing
    
    // Simulate payment processing with security checks
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      tripId,
      type: 'trip_payment',
      amount,
      currency: 'AED',
      method,
      status: 'completed',
      description: metadata?.description || 'Trip payment',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    setTransactions(prev => [transaction, ...prev]);

    // Deduct from wallet if wallet payment
    if (method === 'wallet') {
      setWallet(prev => ({ ...prev, amount: prev.amount - amount }));
    }

    toast.success('Payment completed securely! 🔒', { id: 'payment-processing' });
    return transaction;
  };

  const requestRefund = async (transactionId: string, reason: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        // Create refund transaction
        const refundTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          tripId: t.tripId,
          type: 'refund',
          amount: t.amount,
          currency: t.currency,
          method: t.method,
          status: 'completed',
          description: `Refund: ${reason}`,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        };

        setTransactions(prev => [refundTransaction, ...prev]);
        
        // Add back to wallet
        setWallet(prev => ({ ...prev, amount: prev.amount + t.amount }));

        return { ...t, status: 'refunded' as const };
      }
      return t;
    }));

    toast.success('Refund processed successfully!');
  };

  const topUpWallet = async (amount: number, method: PaymentMethod) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'wallet_topup',
      amount,
      currency: 'AED',
      method,
      status: 'completed',
      description: 'Wallet top-up',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    setTransactions(prev => [transaction, ...prev]);
    setWallet(prev => ({ ...prev, amount: prev.amount + amount }));
    toast.success(`Wallet topped up with ${amount} AED!`);
  };

  const requestSplitPayment = async (request: Omit<SplitPaymentRequest, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would send notifications to all participants
    toast.success('Split payment request sent to all participants');
  };

  const withdrawFromWallet = async (amount: number, destination: string) => {
    if (wallet.amount < amount) {
      toast.error('Insufficient balance');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'withdrawal',
      amount,
      currency: 'AED',
      method: 'wallet',
      status: 'completed',
      description: `Withdrawal to ${destination}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    setTransactions(prev => [transaction, ...prev]);
    setWallet(prev => ({ ...prev, amount: prev.amount - amount }));
    toast.success(`${amount} AED withdrawn successfully!`);
  };

  const getTransactionHistory = (filter?: { status?: PaymentStatus; type?: TransactionType }): Transaction[] => {
    let filtered = [...transactions];

    if (filter?.status) {
      filtered = filtered.filter(t => t.status === filter.status);
    }

    if (filter?.type) {
      filtered = filtered.filter(t => t.type === filter.type);
    }

    return filtered;
  };

  return (
    <PaymentContext.Provider
      value={{
        wallet,
        cards,
        transactions,
        preferredPaymentMethod,
        setPreferredPaymentMethod,
        addCard,
        removeCard,
        setDefaultCard,
        processPayment,
        requestRefund,
        topUpWallet,
        withdrawFromWallet,
        requestSplitPayment,
        getTransactionHistory,
        validatePaymentMethod,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
