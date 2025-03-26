import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { sendMessage, getConversation } from '../../services/messagingService';

type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_name?: string;
  attachment_url?: string;
};

type User = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  user_type: 'homeowner' | 'professional';
};

interface MessagingInterfaceProps {
  currentUserId: string;
  recipientId?: string;
  jobId?: string;
  onClose?: () => void;
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  currentUserId,
  recipientId: propRecipientId,
  jobId,
  onClose
}) => {
  const { userId: paramRecipientId } = useParams<{ userId: string }>();
  const recipientId = propRecipientId || paramRecipientId;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recipient, setRecipient] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages between current user and recipient
  useEffect(() => {
    if (!recipientId || !jobId) return;
    
    const fetchMessages = async () => {
      setIsLoading(true);
      
      try {
        // Use messagingService to get conversation
        const { success, data: messagesData, error: messagesError } = await getConversation(recipientId, jobId);
        
        if (!success) throw new Error(messagesError);
        
        // Fetch recipient user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, first_name, last_name, avatar_url, user_type')
          .eq('id', recipientId)
          .single();
        
        if (userError) throw userError;
        
        setMessages(messagesData || []);
        setRecipient(userData);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages
    const subscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${currentUserId},sender_id=eq.${recipientId}`
      }, payload => {
        // Add new message to state
        setMessages(prevMessages => [...prevMessages, payload.new as Message]);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserId, recipientId, jobId]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() && !attachment) return;
    if (!recipientId) {
      setError('No recipient selected');
      return;
    }
    if (!jobId) {
      setError('No job selected');
      return;
    }
    
    try {
      let attachmentUrl = null;
      
      // Upload attachment if any
      if (attachment) {
        const fileExt = attachment.name.split('.').pop();
        const fileName = `${currentUserId}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('message-attachments')
          .upload(fileName, attachment);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('message-attachments')
          .getPublicUrl(fileName);
        
        attachmentUrl = urlData.publicUrl;
      }
      
      // Use messagingService to send message
      const { success, data, error: messageError } = await sendMessage({
        recipient_id: recipientId,
        job_id: jobId,
        content: newMessage.trim()
      });
      
      if (!success) throw new Error(messageError);
      
      // Add sender name to new message for display
      const messageWithSender = {
        ...data[0],
        sender_name: 'You'
      };
      
      setMessages(prevMessages => [...prevMessages, messageWithSender]);
      setNewMessage('');
      setAttachment(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded shadow">
      {/* Header */}
      <div className="px-4 py-3 border-b flex justify-between items-center bg-blue-600 text-white rounded-t">
        {recipient ? (
          <div className="flex items-center">
            {recipient.avatar_url ? (
              <img 
                src={recipient.avatar_url} 
                alt={`${recipient.first_name} ${recipient.last_name}`}
                className="w-10 h-10 rounded-full mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center mr-3">
                <span className="text-lg font-semibold">
                  {recipient.first_name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold">{`${recipient.first_name} ${recipient.last_name}`}</h3>
              <p className="text-sm text-blue-100">
                {recipient.user_type === 'homeowner' ? 'Homeowner' : 'Professional'}
              </p>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
        {onClose && (
          <button 
            onClick={onClose}
            className="text-white hover:text-blue-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  message.sender_id === currentUserId 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                {message.attachment_url && (
                  <div className="mt-2">
                    <a 
                      href={message.attachment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      View Attachment
                    </a>
                  </div>
                )}
                <div className="text-xs mt-1 text-right">
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-100 text-red-800 text-sm">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </label>
          <button
            type="submit"
            disabled={!newMessage.trim() && !attachment}
            className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        {attachment && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span className="truncate">{attachment.name}</span>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessagingInterface;