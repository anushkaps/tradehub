import { useState, useEffect } from 'react';
import { Bell, MessageSquare, Briefcase, Star, Settings, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../services/supabaseClient';
import { toast } from 'react-toastify';
import { set } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  homeowner: {
    first_name: string;
    last_name: string;
  };
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface Job {
  id: string;
  title: string;
  location: string;
  created_at: string;
  budgetRange: string;
  trade_type: string;
  status: string;
  job_id: string;
}

export function ProfessionalDashboard() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({
    newLeads: 0,
    activeJobs: 0,
    messages: 0,
    rating: 0,
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([])

  const handleBookingAction = async (bookingId: string, status: 'accepted' | 'rejected') => {
    try {
      setActionLoading(bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      const { data: bookingData } = await supabase
        .from('bookings')
        .select(`job_id, userId`)
        .eq('id', bookingId)
        .single();
      if (!bookingData) throw new Error('Booking not found');

      const { error: jobError } = await supabase.from('jobs').update({status: 'ongoing'}).eq('id', bookingData.job_id);
      if (jobError) throw jobError;

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([{
          user_id: bookingData.userId,
          message: `Your booking has been ${status === 'accepted' ? 'accepted' : 'rejected'}.`,
          type: 'job_update',
          action_url: `/professional/job/${bookingData.job_id}`,
          read: false
        }])

      if (notificationError) throw notificationError;

      // Update local state to reflect the change
      setJobs(prevJobs =>
        prevJobs.filter(job => job.id !== bookingId)
      );

      // Refresh stats after action
      fetchStats();
    } catch (error) {
      console.error(`Error ${status === 'accepted' ? 'accepting' : 'rejecting'} booking:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'completed' })
        .eq('id', jobId); // Replace 'job_id' with the actual job ID

      if (error) throw error;

      setJobs(prevJobs =>prevJobs.map(job => (job.id === jobId ? { ...job, status: 'completed' } : job)))

      const { data: jobsDatas } = await supabase
        .from('jobs')
        .select('homeowner_id')
        .eq('id', jobId)
        .single();

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([{
          user_id: jobsDatas?.homeowner_id || '',
          message: `Your job has been marked as completed.`,
          type: 'job_update',
          action_url: `/professional/job/${jobId}`,
          read: false
        }])
      if (notificationError) throw notificationError;

      toast.success('Job marked as completed!');
    } catch (error) {
      console.error('Error marking job as completed:', error);
      toast.error('Failed to mark job as completed.');
    }
  }

  const fetchStats = async () => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      const { count: newLeadsCount } = await supabase
        .from('jobs')
        .select('id', { count: 'exact' })
        .eq('status', 'open');

      const { count: activeJobsCount } = await supabase
        .from('jobs')
        .select('id', { count: 'exact' })
        .eq('status', 'in_progress');

      const { count: messagesCount } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('receiver_id', userId);

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('rating')
        .eq('professional_id', userId);

      let avgRating = 0;
      if (reviewsData && reviewsData.length > 0) {
        const sum = reviewsData.reduce((acc, rev) => acc + rev.rating, 0);
        avgRating = sum / reviewsData.length;
      }

      setStats({
        newLeads: newLeadsCount || 0,
        activeJobs: activeJobsCount || 0,
        messages: messagesCount || 0,
        rating: parseFloat(avgRating.toFixed(1)),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) return;

        // Fetch professional profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        setProfile(profileData);

        // Get professional record
        const { data: professionalData } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (!professionalData?.id) {
          console.error('Professional record not found');
          return;
        }

        // Fetch jobs with bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            status,
            created_at,
            job_id,
            jobs (
              title,
              location,
              trade_type,
              budgetRange
            )
          `)
          .eq('professional_id', professionalData.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
          return;
        }

        const transformedJobs = (bookingsData || []).map(booking => ({
          id: booking.id,
          job_id: booking.job_id,
          title: booking.jobs.title || '',
          location: booking.jobs?.location || '',
          created_at: booking.created_at,
          budgetRange: booking.jobs?.budgetRange || '',
          trade_type: booking.jobs?.trade_type || '',
          status: booking.status,
        }));

        setJobs(transformedJobs);

        // Fetch recent jobs
        const { data: recentJobsData } = await supabase
          .from('jobs')
          .select(`
            id,
            title,
            location,
            created_at,
            budgetRange,
            trade_type,
            status
          `)
          .eq('status', 'ongoing')
          .order('created_at', { ascending: false })
          .limit(3);
        setRecentJobs((recentJobsData || []).map(job => ({
          ...job,
          job_id: job.id, // Assuming job_id can be set to id as a placeholder
        })));

        // Fetch messages
        const { data: messagesData } = await supabase
          .from('messages')
          .select(`
            id,
            sender_id,
            content,
            created_at,
            sender:profiles!sender_id (
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('receiver_id', userId)
          .order('created_at', { ascending: false })
          .limit(2);
        setMessages(messagesData || []);

        // Fetch reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            review_text,
            created_at,
            homeowner:profiles!homeowner_id (
              first_name,
              last_name
            )
          `)
          .eq('professional_id', userId)
          .order('created_at', { ascending: false })
          .limit(3);
        setReviews(reviewsData || []);

        await fetchStats();

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const statItems = [
    {
      label: 'New Leads',
      value: stats.newLeads.toString(),
      icon: <Bell className="w-6 h-6 text-blue-600" />,
      iconBg: 'bg-blue-100',
      trend: { value: '+2.5%', color: 'text-green-500' },
    },
    {
      label: 'Active Jobs',
      value: stats.activeJobs.toString(),
      icon: <Briefcase className="w-6 h-6 text-green-600" />,
      iconBg: 'bg-green-100',
      trend: { value: '0%', color: 'text-gray-500' },
    },
    {
      label: 'Messages',
      value: stats.messages.toString(),
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      iconBg: 'bg-purple-100',
      trend: { value: '+5.0%', color: 'text-green-500' },
    },
    {
      label: 'Rating',
      value: stats.rating.toString(),
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      iconBg: 'bg-yellow-100',
      trend: { value: '+0.2', color: 'text-green-500' },
    },
  ];

  const quickActions = [
    {
      label: 'Update Profile',
      icon: <Settings className="w-5 h-5 text-gray-400" />,
      path: '/professional/profile',
    },
    {
      label: 'Browse Jobs',
      icon: <Briefcase className="w-5 h-5 text-gray-400" />,
      path: '/professional/find-jobs',
    },
    {
      label: 'View Messages',
      icon: <MessageSquare className="w-5 h-5 text-gray-400" />,
      path: '/messages',
    },
  ];

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Professional Dashboard | TradeHub24</title>
        <meta
          name="description"
          content="Manage your trade services, jobs, and client interactions from your TradeHub24 professional dashboard."
        />
      </Helmet>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {profile?.first_name || 'Professional'}
            </h1>
            <p className="text-gray-600">Here's what's happening with your business</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {statItems.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>{stat.icon}</div>
                  <span className={`text-sm font-medium ${stat.trend.color}`}>
                    {stat.trend.value}
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Jobs & Messages */}
            <div className="md:col-span-2">
              {/* Invitations */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Invitations</h2>
                  <Link
                    to="/professional/browse-jobs"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-6">
                  {jobs.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      No invitations at the moment.
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
                      >
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.location}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(job.created_at)}
                          </p>
                          <p className="text-sm font-medium">{job.budgetRange}</p>
                          <p className="text-sm text-gray-600">{job.trade_type}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleBookingAction(job.id, 'accepted')}
                            disabled={actionLoading === job.id}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                          >
                            {actionLoading === job.id ? 'Processing...' : 'Accept'}
                          </button>
                          <button
                            onClick={() => handleBookingAction(job.id, 'rejected')}
                            disabled={actionLoading === job.id}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                          >
                            {actionLoading === job.id ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Recent Jobs</h2>
                  <Link
                    to="/professional/jobs"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentJobs.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      No jobs yet.
                    </div>
                  ) : (
                    recentJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
                      >
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.location}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(job.created_at)}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">{job.status}</span>
                        <button onClick={()=>handleComplete(job.id)} className='bg-blue-600 text-white py-4 px-2 rounded-md'>Mark as Completed</button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Messages */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Recent Messages</h2>
                  <Link
                    to="/messages"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      No messages yet.
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white mr-4">
                            {message.sender.avatar_url ? (
                              <img
                                src={message.sender.avatar_url}
                                alt={`${message.sender.first_name}'s avatar`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              message.sender.first_name[0]
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {message.sender.first_name} {message.sender.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {message.content.length > 50
                                ? `${message.content.substring(0, 50)}...`
                                : message.content}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Quick Actions & Reviews */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.path}
                      className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        {action.icon}
                        <span className="ml-3 font-medium">{action.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Recent Reviews</h2>
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      No reviews yet.
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-4 last:border-0"
                      >
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.review_text}</p>
                        <p className="text-gray-500 text-sm mt-2">
                          {review.homeowner.first_name} {review.homeowner.last_name} •{' '}
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessionalDashboard;