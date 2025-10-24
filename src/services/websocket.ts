/**
 * WebSocket Service
 * Real-time communication for trips, messages, and notifications
 */

import { env } from '../config/env';

type WebSocketEventType = 
  | 'trip_update'
  | 'new_message'
  | 'notification'
  | 'location_update'
  | 'booking_request'
  | 'booking_accepted'
  | 'booking_rejected';

interface WebSocketMessage {
  type: WebSocketEventType;
  data: any;
  timestamp: number;
}

type EventHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private  handlers: Map<WebSocketEventType, Set<EventHandler>> = new Map();
  private isConnecting = false;

  /**
   * Connect to WebSocket server
   */
  connect(userId: string): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${env.WS_URL}?userId=${userId}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          this.isConnecting = false;
          this.attemptReconnect(userId);
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  /**
   * Send a message through WebSocket
   */
  send(type: WebSocketEventType, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now(),
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  /**
   * Subscribe to an event type
   */
  on(type: WebSocketEventType, handler: EventHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => this.off(type, handler);
  }

  /**
   * Unsubscribe from an event type
   */
  off(type: WebSocketEventType, handler: EventHandler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Handle incoming message
   */
  private handleMessage(message: WebSocketMessage) {
    const handlers = this.handlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message.data));
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect(userId).catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Get connection status
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();

/**
 * React Hook for WebSocket
 */
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useWebSocket() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      wsService.connect(user.id);
    }

    return () => {
      wsService.disconnect();
    };
  }, [user?.id]);

  return wsService;
}

/**
 * Hook for subscribing to specific events
 */
export function useWebSocketEvent(
  type: WebSocketEventType,
  handler: EventHandler
) {
  useEffect(() => {
    const unsubscribe = wsService.on(type, handler);
    return unsubscribe;
  }, [type, handler]);
}
