import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import MessagingInterface from '../../components/shared/MessagingInterface';

interface Conversation {
  id: string;
  job_id: string;
  job_title: string;
  professional_id: string;
  professional_name: string;
  professional_avatar: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  status: 'active' | 'archived';
}

interface Job {
  id: string;
  title: string;
  status: string;
}

const HomeownerMessages: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract jobId from URL if present
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get('jobId');
  const professionalId = queryParams.get('proId');

  useEffect(() => {
    // Check if the user is authenticated and is a homeowner
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw new Error(authError.message);
        
        if (!user) {
          navigate('/homeowner/HomeownerLogin');
          return;
        }
        
        // Check if user is a homeowner
        const { data: homeowner, error: homeownerError } = await supabase
          .from('homeowners')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (homeownerError && homeownerError.code !== 'PGRST116') {
          throw new Error(homeownerError.message);
        }
        
        if (!homeowner) {
          navigate('/homeowner/HomeownerLogin');
          return;
        }
        
        // Fetch conversations
        await fetchConversations(user.id);
        
        // Fetch active jobs
        await fetchActiveJobs(user.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchConversations = async (userId: string) => {
    try {
      // Get all conversations where the homeowner is involved
      const { data, error: convoError } = await supabase
        .from('conversations')
        .select(`
          id,
          job_id,
          jobs!inner(title, status),
          professional_id,
          professionals!inner(full_name, avatar_url),
          last_message,
          last_message_time,
          unread_homeowner_count,
          status
        `)
        .eq('homeowner_id', userId)
        .order('last_message_time', { ascending: false });
      
      if (convoError) throw new Error(convoError.message);
      
      if (data) {
        const transformedConversations: Conversation[] = data.map((item: any) => ({
          id: item.id,
          job_id: item.job_id,
          job_title: item.jobs.title,
          professional_id: item.professional_id,
          professional_name: item.professionals.full_name,
          professional_avatar: item.professionals.avatar_url,
          last_message: item.last_message || 'Start a conversation',
          last_message_time: item.last_message_time || new Date().toISOString(),
          unread_count: item.unread_homeowner_count || 0,
          status: item.status
        }));
        
        setConversations(transformedConversations);
        
        // If jobId is in URL, select the corresponding conversation
        if (jobId && professionalId) {
          const conversation = transformedConversations.find(
            c => c.job_id === jobId && c.professional_id === professionalId
          );
          
          if (conversation) {
            setSelectedConversation(conversation.id);
            setSelectedJob({ id: conversation.job_id, title: conversation.job_title, status: '' });
            setSelectedProfessionalId(conversation.professional_id);
          } else {
            // Create a new conversation if one doesn't exist for this job and professional
            await createNewConversation(userId, jobId, professionalId);
          }
        } else if (transformedConversations.length > 0) {
          // Select the first conversation if none is selected
          setSelectedConversation(transformedConversations[0].id);
          setSelectedJob({ id: transformedConversations[0].job_id, title: transformedConversations[0].job_title, status: '' });
          setSelectedProfessionalId(transformedConversations[0].professional_id);
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
      setIsLoading(false);
    }
  };

  const fetchActiveJobs = async (userId: string) => {
    try {
      // Get all active jobs posted by the homeowner
      const { data, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, status')
        .eq('homeowner_id', userId)
        .in('status', ['open', 'in_progress'])
        .order('created_at', { ascending: false });
      
      if (jobsError) throw new Error(jobsError.message);
      
      if (data) {
        setActiveJobs(data as Job[]);
      }
    } catch (err) {
      console.error('Failed to load active jobs:', err);
      // Not setting error state here to not block the main functionality
    }
  };

  const createNewConversation = async (homeownerId: string, jobId: string, professionalId: string) => {
    try {
      // First check if the job exists and the professional is valid
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('title')
        .eq('id', jobId)
        .single();
      
      if (jobError) throw new Error('Job not found');
      
      const { data: professional, error: proError } = await supabase
        .from('professionals')
        .select('full_name')
        .eq('id', professionalId)
        .single();
      
      if (proError) throw new Error('Professional not found');
      
      // Create a new conversation
      const { data: newConvo, error: createError } = await supabase
        .from('conversations')
        .insert({
          homeowner_id: homeownerId,
          professional_id: professionalId,
          job_id: jobId,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (createError) throw new Error(createError.message);
      
      if (newConvo) {
        // Add this new conversation to the state
        const newConversation: Conversation = {
          id: newConvo.id,
          job_id: jobId,
          job_title: job.title,
          professional_id: professionalId,
          professional_name: professional.full_name,
          professional_avatar: null,
          last_message: 'Start a conversation',
          last_message_time: new Date().toISOString(),
          unread_count: 0,
          status: 'active'
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConvo.id);
        setSelectedJob({ id: jobId, title: job.title, status: '' });
        setSelectedProfessionalId(professionalId);
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to create conversation. Please try again.');
    }
  };

  const startNewConversation = async (jobId: string, professionalId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await createNewConversation(user.id, jobId, professionalId);
      }
    } catch (err) {
      setError('Failed to start conversation. Please try again.');
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Update URL
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      navigate(`/homeowner/Messages?jobId=${conversation.job_id}&proId=${conversation.professional_id}`);
      
      // Mark conversation as read
      markConversationAsRead(conversationId);
      setSelectedJob({ id: conversation.job_id, title: conversation.job_title, status: '' });
      setSelectedProfessionalId(conversation.professional_id);
    }
  };

  const markConversationAsRead = async (conversationId: string) => {
    try {
      // Update unread count to 0 for this conversation
      await supabase
        .from('conversations')
        .update({ unread_homeowner_count: 0 })
        .eq('id', conversationId);
      
      // Update local state
      setConversations(prev => 
        prev.map(convo => 
          convo.id === conversationId 
            ? { ...convo, unread_count: 0 } 
            : convo
        )
      );
    } catch (err) {
      console.error('Failed to mark conversation as read:', err);
    }
  };

  const filterConversations = () => {
    if (!searchQuery) return conversations;
    
    return conversations.filter(convo => 
      convo.professional_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      convo.job_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold">Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
      
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md h-[calc(100vh-12rem)]">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Start new conversation dropdown */}
          {activeJobs.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  onClick={() => document.getElementById('jobDropdown')?.classList.toggle('hidden')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Message
                </button>
                <div id="jobDropdown" className="hidden absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 font-semibold">Select a job:</div>
                  {activeJobs.map(job => (
                    <div key={job.id} className="px-4 py-2 hover:bg-gray-100">
                      <div className="text-sm font-medium">{job.title}</div>
                      <button 
                        className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => navigate(`/homeowner/ProfessionalSearch?jobId=${job.id}`)}
                      >
                        Find professionals
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto">
            {filterConversations().length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="mb-2">No conversations found</p>
                <p className="text-sm">Post a job to start messaging with professionals</p>
                <button 
                  onClick={() => navigate('/homeowner/PostJob')} 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Post a Job
                </button>
              </div>
            ) : (
              filterConversations().map(conversation => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                    selectedConversation === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleConversationSelect(conversation.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {conversation.professional_avatar ? (
                        <img
                          src={conversation.professional_avatar}
                          alt={conversation.professional_name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          {conversation.professional_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{conversation.professional_name}</h3>
                        <p className="text-xs text-gray-500">{getRelativeTime(conversation.last_message_time)}</p>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{conversation.job_title}</p>
                      <p className="text-sm text-gray-500 truncate mt-1">{conversation.last_message}</p>
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Messaging Interface */}
        <div className="w-full md:w-2/3 flex flex-col">
          {selectedConversation && selectedProfessionalId && (
            <MessagingInterface 
              currentUserId={selectedConversation}
              jobId={selectedJob?.id}
              recipientId={selectedProfessionalId}
              onClose={() => {
                // Refresh conversations to update last message
                const fetchUser = async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) fetchConversations(user.id);
                };
                fetchUser();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeownerMessages;