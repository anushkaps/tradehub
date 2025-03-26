import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import MessagingInterface from '../../components/shared/MessagingInterface';

interface Conversation {
  id: string;
  job_id: string;
  job_title: string;
  homeowner_id: string;
  homeowner_name: string;
  homeowner_avatar: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  status: 'active' | 'archived';
}

interface Job {
  id: string;
  title: string;
  status: string;
  homeowner_id: string;
}

const ProfessionalMessages: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract jobId and homeownerId from URL if present
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get('jobId');
  const homeownerId = queryParams.get('homeownerId');

  useEffect(() => {
    // Check if the user is authenticated and is a professional
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw new Error(authError.message);
        
        if (!user) {
          navigate('/professional/ProfessionalLogin');
          return;
        }
        
        // Check if user is a professional
        const { data: professional, error: professionalError } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (professionalError && professionalError.code !== 'PGRST116') {
          throw new Error(professionalError.message);
        }
        
        if (!professional) {
          navigate('/professional/ProfessionalLogin');
          return;
        }
        
        // Fetch conversations
        await fetchConversations(user.id);
        
        // Fetch available jobs
        await fetchAvailableJobs();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchConversations = async (userId: string) => {
    try {
      // Get all conversations where the professional is involved
      const { data, error: convoError } = await supabase
        .from('conversations')
        .select(`
          id,
          job_id,
          jobs!inner(title, status),
          homeowner_id,
          homeowners!inner(full_name, avatar_url),
          last_message,
          last_message_time,
          unread_professional_count,
          status
        `)
        .eq('professional_id', userId)
        .order('last_message_time', { ascending: false });
      
      if (convoError) throw new Error(convoError.message);
      
      if (data) {
        const transformedConversations: Conversation[] = data.map((item: any) => ({
          id: item.id,
          job_id: item.job_id,
          job_title: item.jobs.title,
          homeowner_id: item.homeowner_id,
          homeowner_name: item.homeowners.full_name,
          homeowner_avatar: item.homeowners.avatar_url,
          last_message: item.last_message || 'Start a conversation',
          last_message_time: item.last_message_time || new Date().toISOString(),
          unread_count: item.unread_professional_count || 0,
          status: item.status
        }));
        
        setConversations(transformedConversations);
        
        // If jobId is in URL, select the corresponding conversation
        if (jobId && homeownerId) {
          const conversation = transformedConversations.find(
            c => c.job_id === jobId && c.homeowner_id === homeownerId
          );
          
          if (conversation) {
            setSelectedConversation(conversation.id);
          } else {
            // Create a new conversation if one doesn't exist for this job and homeowner
            await createNewConversation(userId, jobId, homeownerId);
          }
        } else if (transformedConversations.length > 0) {
          // Select the first conversation if none is selected
          setSelectedConversation(transformedConversations[0].id);
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
      setIsLoading(false);
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      // Get jobs that match the professional's trade category and location
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return;
      }
      
      // First get the professional's details including trade category and location
      const { data: professionalData, error: proError } = await supabase
        .from('professionals')
        .select('id, trade_category, service_area_postal_codes')
        .eq('user_id', user.id)
        .single();
      
      if (proError) {
        console.error('Failed to fetch professional details:', proError);
        return;
      }
      
      // Then find matching jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, status, homeowner_id, postal_code, trade_category')
        .eq('status', 'open')
        .eq('trade_category', professionalData.trade_category)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (jobsError) {
        console.error('Failed to fetch available jobs:', jobsError);
        return;
      }
      
      // Filter by service area if available
      let filteredJobs = jobs;
      if (professionalData.service_area_postal_codes && professionalData.service_area_postal_codes.length > 0) {
        // Simple filtering - in a real app, you might use a more sophisticated 
        // geographical matching algorithm
        filteredJobs = jobs.filter(job => 
          professionalData.service_area_postal_codes.some((code: string) => 
            job.postal_code && job.postal_code.startsWith(code.substring(0, 3))
          )
        );
      }
      
      setAvailableJobs(filteredJobs as Job[]);
    } catch (err) {
      console.error('Failed to load available jobs:', err);
      // Not setting error state here to not block the main functionality
    }
  };

  const createNewConversation = async (professionalId: string, jobId: string, homeownerId: string) => {
    try {
      // First check if the job exists and the homeowner is valid
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('title')
        .eq('id', jobId)
        .single();
      
      if (jobError) throw new Error('Job not found');
      
      const { data: homeowner, error: homeownerError } = await supabase
        .from('homeowners')
        .select('full_name')
        .eq('id', homeownerId)
        .single();
      
      if (homeownerError) throw new Error('Homeowner not found');
      
      // Create a new conversation
      const { data: newConvo, error: createError } = await supabase
        .from('conversations')
        .insert({
          professional_id: professionalId,
          homeowner_id: homeownerId,
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
          homeowner_id: homeownerId,
          homeowner_name: homeowner.full_name,
          homeowner_avatar: null,
          last_message: 'Start a conversation',
          last_message_time: new Date().toISOString(),
          unread_count: 0,
          status: 'active'
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConvo.id);
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to create conversation. Please try again.');
    }
  };

  const startNewConversation = async (jobId: string, homeownerId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await createNewConversation(user.id, jobId, homeownerId);
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
      navigate(`/professional/Messages?jobId=${conversation.job_id}&homeownerId=${conversation.homeowner_id}`);
      
      // Mark conversation as read
      markConversationAsRead(conversationId);
    }
  };

  const markConversationAsRead = async (conversationId: string) => {
    try {
      // Update unread count to 0 for this conversation
      await supabase
        .from('conversations')
        .update({ unread_professional_count: 0 })
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
      convo.homeowner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          
          {/* Find job opportunities dropdown */}
          {availableJobs.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  onClick={() => document.getElementById('jobDropdown')?.classList.toggle('hidden')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Job Opportunities
                </button>
                <div id="jobDropdown" className="hidden absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg py-1 max-h-60 overflow-y-auto">
                  <div className="px-4 py-2 text-sm text-gray-700 font-semibold">Available jobs in your area:</div>
                  {availableJobs.map(job => (
                    <div key={job.id} className="px-4 py-2 hover:bg-gray-100">
                      <div className="text-sm font-medium">{job.title}</div>
                      <div className="flex justify-between mt-1">
                        <button 
                          className="text-xs text-blue-600 hover:text-blue-800"
                          onClick={() => navigate(`/professional/JobDetails?jobId=${job.id}`)}
                        >
                          View details
                        </button>
                        <button 
                          className="text-xs text-green-600 hover:text-green-800"
                          onClick={() => startNewConversation(job.id, job.homeowner_id)}
                        >
                          Message homeowner
                        </button>
                      </div>
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
                <p className="text-sm">Browse job listings to start messaging with homeowners</p>
                <button 
                  onClick={() => navigate('/professional/JobSearch')} 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Find Jobs
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
                      {conversation.homeowner_avatar ? (
                        <img
                          src={conversation.homeowner_avatar}
                          alt={conversation.homeowner_name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                          {conversation.homeowner_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{conversation.homeowner_name}</h3>
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
          {selectedConversation ? (
            <MessagingInterface 
              currentUserId={selectedConversation}
              recipientId={selectedConversation}
              jobId={selectedConversation}
              onClose={() => {
                // Refresh conversations to update last message
                const fetchUser = async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) fetchConversations(user.id);
                };
                fetchUser();
              }}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Start a Conversation</h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Select a conversation from the sidebar or find jobs to connect with homeowners.
              </p>
              <button 
                onClick={() => navigate('/professional/JobSearch')} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Find Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalMessages;