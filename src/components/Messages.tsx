import { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, Send, MoreVertical, Phone, Video, Info, Globe } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

export function Messages() {
  const { conversations, messages, sendMessage, markAsRead, getConversationMessages } = useChat();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]?.id);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? getConversationMessages(selectedConversation) : [];

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    // Mark as read when conversation is selected
    if (selectedConversation) {
      markAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    await sendMessage(selectedConversation, messageText);
    setMessageText('');
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const otherParticipant = conv.participants.find(p => p.id !== user?.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1>{t('nav.messages')}</h1>
        <p className="text-muted-foreground">Chat with your co-travelers</p>
      </div>

      <Card className="h-[calc(100vh-16rem)] flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r flex flex-col bg-muted/30">
          <div className="p-4 border-b bg-background">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No conversations yet</p>
              </div>
            ) : (
              <div>
                {filteredConversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
                  if (!otherParticipant) return null;

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-4 border-b text-left transition-colors ${
                        selectedConversation === conversation.id 
                          ? 'bg-primary/10 border-primary/20' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={otherParticipant.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {otherParticipant.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {otherParticipant.isOnline && (
                            <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">{otherParticipant.name}</p>
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage.senderId === user?.id ? 'You: ' : ''}
                              {conversation.lastMessage.message}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {conversation.tripId && (
                              <span className="text-xs text-primary">Trip Chat</span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-accent text-accent-foreground">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-background flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const otherParticipant = currentConversation.participants.find(p => p.id !== user?.id);
                    return otherParticipant ? (
                      <>
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={otherParticipant.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {otherParticipant.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {otherParticipant.isOnline && (
                            <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{otherParticipant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {otherParticipant.isOnline ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowTranslation(!showTranslation)}
                    className={showTranslation ? 'bg-primary/10 text-primary' : ''}
                  >
                    <Globe className="size-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Phone className="size-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="size-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="size-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentMessages.map((message) => {
                    const isOwnMessage = message.senderId === user?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isOwnMessage
                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                : 'bg-muted rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            {showTranslation && message.translatedMessage && language === 'ar' && !isOwnMessage && (
                              <p className="text-xs mt-2 opacity-70 border-t border-primary-foreground/20 pt-2">
                                {message.translatedMessage}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground px-1">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={t('message.send')}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!messageText.trim()}>
                    <Send className="size-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Send className="size-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
