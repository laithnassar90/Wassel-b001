import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner@2.0.3';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  translatedMessage?: string; // Auto-translated to recipient's language
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  }>;
  lastMessage?: ChatMessage;
  unreadCount: number;
  tripId?: string;
  createdAt: string;
}

interface ChatContextType {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  sendMessage: (conversationId: string, message: string) => Promise<void>;
  markAsRead: (conversationId: string) => void;
  createConversation: (participantIds: string[], tripId?: string) => Promise<Conversation>;
  getConversationMessages: (conversationId: string) => ChatMessage[];
  totalUnreadCount: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: [
      { id: '2', name: 'Ahmed Hassan', isOnline: true },
      { id: '1', name: 'Current User', isOnline: true },
    ],
    unreadCount: 2,
    tripId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: '2',
    participants: [
      { id: '3', name: 'Sara Mohammed', isOnline: false },
      { id: '1', name: 'Current User', isOnline: true },
    ],
    unreadCount: 0,
    tripId: '2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const mockMessages: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1',
      conversationId: '1',
      senderId: '2',
      senderName: 'Ahmed Hassan',
      message: 'Hi! I will be there at 8 AM sharp.',
      translatedMessage: 'مرحباً! سأكون هناك الساعة 8 صباحاً بالضبط.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
    },
    {
      id: '2',
      conversationId: '1',
      senderId: '2',
      senderName: 'Ahmed Hassan',
      message: 'Please be ready by then.',
      timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
      read: false,
    },
    {
      id: '3',
      conversationId: '1',
      senderId: '1',
      senderName: 'Current User',
      message: 'Perfect! See you tomorrow.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      read: true,
    },
  ],
  '2': [
    {
      id: '4',
      conversationId: '2',
      senderId: '3',
      senderName: 'Sara Mohammed',
      message: 'Thanks for the ride!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
    },
    {
      id: '5',
      conversationId: '2',
      senderId: '1',
      senderName: 'Current User',
      message: 'You are welcome!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      read: true,
    },
  ],
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(mockMessages);

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const sendMessage = async (conversationId: string, message: string) => {
    if (!user) return;

    await new Promise(resolve => setTimeout(resolve, 300));

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      conversationId,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      message,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    // Update conversation's last message
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: newMessage,
        };
      }
      return conv;
    }));

    // Simulate auto-reply for demo (delete in production)
    setTimeout(() => {
      const otherParticipant = conversations
        .find(c => c.id === conversationId)
        ?.participants.find(p => p.id !== user.id);

      if (otherParticipant) {
        const replyMessage: ChatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          conversationId,
          senderId: otherParticipant.id,
          senderName: otherParticipant.name,
          senderAvatar: otherParticipant.avatar,
          message: 'Got it! Thanks for the update.',
          timestamp: new Date().toISOString(),
          read: false,
        };

        setMessages(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), replyMessage],
        }));

        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: replyMessage,
              unreadCount: conv.unreadCount + 1,
            };
          }
          return conv;
        }));
      }
    }, 2000);
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));

    setMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => ({ ...msg, read: true })),
    }));
  };

  const createConversation = async (participantIds: string[], tripId?: string): Promise<Conversation> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newConversation: Conversation = {
      id: Math.random().toString(36).substr(2, 9),
      participants: participantIds.map(id => ({
        id,
        name: `User ${id}`,
        isOnline: Math.random() > 0.5,
      })),
      unreadCount: 0,
      tripId,
      createdAt: new Date().toISOString(),
    };

    setConversations(prev => [newConversation, ...prev]);
    setMessages(prev => ({ ...prev, [newConversation.id]: [] }));

    toast.success('Conversation started!');
    return newConversation;
  };

  const getConversationMessages = (conversationId: string): ChatMessage[] => {
    return messages[conversationId] || [];
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        sendMessage,
        markAsRead,
        createConversation,
        getConversationMessages,
        totalUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
