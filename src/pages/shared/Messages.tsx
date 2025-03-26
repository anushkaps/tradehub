import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../services/supabaseClient';

interface Message {
  id: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  sender_profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  receiver_profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface Conversation {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

const Messages: React.FC = () => {
  const { user, profile } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch conversations
  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setLoading(true);
      try {
        // Get all messages where the current user is either sender or receiver
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            id,
            created_at,
            sender_id,
            receiver_id,
            content,
            is_read,
            sender_profile:profiles!sender_id(first_name, last_name, avatar_url),
            receiver_profile:profiles!receiver_id(first_name, last_name, avatar_url)
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        // Process messages to create conversation list
        const conversationMap = new Map<string, Conversation>();
        
        messagesData?.forEach((message: Message) => {
          const isUserSender = message.sender_id === user.id;
          const otherUserId = isUserSender ? message.receiver_id : message.sender_id;
          const otherUserProfile = isUserSender ? message.receiver_profile : message.sender_profile;
          
          if (!conversationMap.has(otherUserId) && otherUserProfile) {
            conversationMap.set(otherUserId, {
              user_id: otherUserId,
              first_name: otherUserProfile.first_name,
              last_name: otherUserProfile.last_name,
              avatar_url: otherUserProfile.avatar_url,
              last_message: message.content,
              last_message_time: message.created_at,
              unread_count: (!isUserSender && !message.is_read) ? 1 : 0
            });
          } else if (otherUserProfile) {
            const conversation = conversationMap.get(otherUserId);
            if (conversation) {
              if (!isUserSender && !message.is_read) {
                conversation.unread_count += 1;
              }
            }
          }
        });
        
        setConversations(Array.from(conversationMap.values()));
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!user || !selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            created_at,
            sender_id,
            receiver_id,
            content,
            is_read,
            sender_profile:profiles!sender_id(first_name, last_name, avatar_url),
            receiver_profile:profiles!receiver_id(first_name, last_name, avatar_url)
          `)
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedConversation}),and(sender_id.eq.${selectedConversation},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);

        // Mark messages as read
        const unreadMessages = data?.filter(
          (msg: Message) => msg.receiver_id === user.id && !msg.is_read
        ) || [];

        if (unreadMessages.length > 0) {
          const unreadIds = unreadMessages.map((msg: Message) => msg.id);
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadIds);
            
          // Update conversation unread count
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv.user_id === selectedConversation 
                ? { ...conv, unread_count: 0 } 
                : conv
            )
          );
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `or(and(sender_id=eq.${user.id},receiver_id=eq.${selectedConversation}),and(sender_id=eq.${selectedConversation},receiver_id=eq.${user.id}))` 
      }, (payload) => {
        // Add new message to the list
        const newMsg = payload.new as Message;
        setMessages(prev => [...prev, newMsg]);
        
        // If the message is from the other user, mark it as read
        if (newMsg.sender_id === selectedConversation) {
          supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', newMsg.id);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedConversation) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedConversation,
          content: newMessage,
          is_read: false
        })
        .select(`
          id,
          created_at,
          sender_id,
          receiver_id,
          content,
          is_read,
          sender_profile:profiles!sender_id(first_name, last_name, avatar_url),
          receiver_profile:profiles!receiver_id(first_name, last_name, avatar_url)
        `);

      if (error) throw error;

      // Update conversations list with the new message
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.user_id === selectedConversation 
            ? { 
                ...conv, 
                last_message: newMessage,
                last_message_time: new Date().toISOString()
              } 
            : conv
        )
      );

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Conversations List */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Conversations</h2>
            </div>
            <div className="divide-y overflow-y-auto" style={{ maxHeight: '500px' }}>
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No conversations yet</div>
              ) : (
                conversations.map((conversation) => (
                  <div 
                    key={conversation.user_id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedConversation === conversation.user_id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedConversation(conversation.user_id)}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                        {conversation.avatar_url ? (
                          <img src={conversation.avatar_url} alt="Avatar" className="h-10 w-10 rounded-full" />
                        ) : (
                          conversation.first_name[0]
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{`${conversation.first_name} ${conversation.last_name}`}</p>
                          {conversation.unread_count > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                              {conversation.unread_count}
                            </span>
                          )}
                        </div>
                        {conversation.last_message && (
                          <p className="text-sm text-gray-500 truncate">{conversation.last_message}</p>
                        )}
                        {conversation.last_message_time && (
                          <p className="text-xs text-gray-400">{formatDate(conversation.last_message_time)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow flex flex-col" style={{ height: '600px' }}>
            {selectedConversation ? (
              <>
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">
                    {conversations.find(c => c.user_id === selectedConversation)?.first_name} {' '}
                    {conversations.find(c => c.user_id === selectedConversation)?.last_name}
                  </h2>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`mb-4 flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                          message.sender_id === user?.id 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
