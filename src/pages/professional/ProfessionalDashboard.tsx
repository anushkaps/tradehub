import { useState, useEffect } from 'react';
import { Bell, MessageSquare, Briefcase, Star, Settings, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../services/supabaseClient';

interface JobRequest {
  id: string;
  title: string;
  location: string;
  created_at: string;
  budget: number;
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

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  homeowner: {
    first_name: string;
    last_name: string;
  };
}

export function ProfessionalDashboard() {
  const { user, profile } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    newLeads: 0,
    activeJobs: 0,
    messages: 0,
    rating: 0,
  });

  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1) Fetch job requests
        const { data: jobsData, error: jobsError, count: _unused } = await supabase
          .from('jobs')
          .select(
            `
              id,
              title,
              location,
              created_at,
              budget,
              homeowner:profiles!homeowner_id(first_name, last_name)
            `
          )
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(3);

        if (jobsError) throw jobsError;

        // Convert any array-based homeowner data to a single object
        const transformedJobsData: JobRequest[] = (jobsData || []).map((job: any) => {
          // Supabase might return homeowner as an array if you used "profiles!homeowner_id(...)"
          const singleHomeowner = Array.isArray(job.homeowner) ? job.homeowner[0] : job.homeowner;
          return {
            id: job.id,
            title: job.title,
            location: job.location,
            created_at: job.created_at,
            budget: job.budget,
            homeowner: {
              first_name: singleHomeowner?.first_name || '',
              last_name: singleHomeowner?.last_name || '',
            },
          };
        });
        setJobRequests(transformedJobsData);

        // 2) Active jobs count
        const { count: activeJobsCount, error: activeJobsError } = await supabase
          .from('jobs')
          .select('id', { count: 'exact' })
          .eq('professional_id', user.id)
          .eq('status', 'in_progress');

        if (activeJobsError) throw activeJobsError;

        // 3) New leads count
        const { count: newLeadsCount, error: newLeadsError } = await supabase
          .from('jobs')
          .select('id', { count: 'exact' })
          .eq('status', 'open');
        if (newLeadsError) throw newLeadsError;

        // 4) Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(
            `
              id,
              sender_id,
              content,
              created_at,
              sender:profiles!sender_id(first_name, last_name, avatar_url)
            `
          )
          .eq('receiver_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2);
        if (messagesError) throw messagesError;

        // Transform messages (handle array-based sender)
        const formattedMessages: Message[] = (messagesData || []).map((msg: any) => {
          const singleSender = Array.isArray(msg.sender) ? msg.sender[0] : msg.sender;
          return {
            id: msg.id,
            sender_id: msg.sender_id,
            content: msg.content,
            created_at: msg.created_at,
            sender: {
              first_name: singleSender?.first_name || '',
              last_name: singleSender?.last_name || '',
              avatar_url: singleSender?.avatar_url || undefined,
            },
          };
        });
        setMessages(formattedMessages);

        // 5) Unread messages count
        const { count: messagesCount, error: messagesCountError } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('receiver_id', user.id)
          .eq('read', false);
        if (messagesCountError) throw messagesCountError;

        // 6) Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(
            `
              id,
              rating,
              comment,
              created_at,
              homeowner:profiles!homeowner_id(first_name, last_name)
            `
          )
          .eq('professional_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
        if (reviewsError) throw reviewsError;

        // Transform reviews (handle array-based homeowner)
        const transformedReviews: Review[] = (reviewsData || []).map((r: any) => {
          const singleHomeowner = Array.isArray(r.homeowner) ? r.homeowner[0] : r.homeowner;
          return {
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            homeowner: {
              first_name: singleHomeowner?.first_name || '',
              last_name: singleHomeowner?.last_name || '',
            },
          };
        });
        setReviews(transformedReviews);

        // Calculate average rating
        let avgRating = 0;
        if (transformedReviews.length > 0) {
          const sum = transformedReviews.reduce((acc, rev) => acc + rev.rating, 0);
          avgRating = sum / transformedReviews.length;
        }

        // Update stats
        setStats({
          newLeads: newLeadsCount || 0,
          activeJobs: activeJobsCount || 0,
          messages: messagesCount || 0,
          rating: parseFloat(avgRating.toFixed(1)),
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
          content="Manage your trade services, bids, and client interactions from your TradeHub24 professional dashboard."
        />
        <meta
          name="keywords"
          content="professional dashboard, tradehub24, manage bids"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Professional Dashboard | TradeHub24"
        />
        <meta
          property="og:description"
          content="Manage your trade services, bids, and client interactions from your TradeHub24 professional dashboard."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.tradehub24.com/professional/dashboard"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Professional Dashboard | TradeHub24"
        />
        <meta
          name="twitter:description"
          content="Manage your trade services, bids, and client interactions from your TradeHub24 professional dashboard."
        />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Professional Dashboard | TradeHub24",
            url: "https://www.tradehub24.com/professional/dashboard",
            description:
              "Manage your trade services, bids, and client interactions from your TradeHub24 professional dashboard.",
            publisher: {
              "@type": "Organization",
              name: "TradeHub24",
              url: "https://www.tradehub24.com",
            },
          })}
        </script>
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
                  <span className={`text-sm font-medium ${stat.trend.color}`}>{stat.trend.value}</span>
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Job Requests & Messages */}
            <div className="md:col-span-2">
              {/* Recent Job Requests */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Recent Job Requests</h2>
                  <Link
                    to="/professional/browse-jobs"
                    className="text-[#105298] hover:text-[#0c3d72] text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-6">
                  {jobRequests.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      No job requests available at the moment.
                    </div>
                  ) : (
                    jobRequests.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
                      >
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.location}</p>
                          <p className="text-sm text-gray-500">{formatDate(job.created_at)}</p>
                          <p className="text-sm font-medium">{formatCurrency(job.budget)}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Link
                            to={`/professional/job/${job.id}`}
                            className="px-4 py-2 bg-[#105298] text-white rounded-md hover:bg-[#0c3d72]"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Messages */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Recent Messages</h2>
                  <Link to="/messages" className="text-[#105298] hover:text-[#0c3d72] text-sm font-medium">
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">No messages yet.</div>
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
                                alt={message.sender.first_name}
                                className="w-10 h-10 rounded-full"
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
                        <span className="text-sm text-gray-500">{formatDate(message.created_at)}</span>
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
                    <div className="text-center text-gray-500 py-4">No reviews yet.</div>
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
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
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
